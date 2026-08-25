import { useEffect, useMemo, useState } from 'react'
import { supabase } from "../../supabase";
import Swal from 'sweetalert2'
import { Award, Upload, Trash2, ImageIcon, Plus, Search, X } from 'lucide-react'
import {
  uploadImageToBucket,
  deleteImagesFromBucket,
  validateImageFile,
} from '../../utils/imageStorage'

const BUCKET = 'certificate-images'

const swalDark = {
  background: '#0d0505',
  color: '#e5e7eb',
  confirmButtonColor: '#2563eb',
  cancelButtonColor: 'rgba(255,255,255,0.1)',
}

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  ...swalDark,
})

const confirmDelete = (text) =>
  Swal.fire({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    ...swalDark,
  })

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden">
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
        )}
        <img
          src={cert.Img}
          alt={cert.Title || 'Certificate'}
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
        />
        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
            {cert.Title && (
              <p className="text-xs text-white/90 font-medium line-clamp-2">{cert.Title}</p>
            )}
            <button
              onClick={() => onDelete(cert)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [pending, setPending] = useState([]) // [{id, file, preview, title}]
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null) // {done, total}
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchCerts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    if (error) toast.fire({ icon: 'error', title: 'Failed to load certificates' })
    setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const filteredCerts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return certs
    return certs.filter((c) => (c.Title || '').toLowerCase().includes(q))
  }, [certs, search])

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return
    const accepted = []
    for (const f of files) {
      const check = validateImageFile(f)
      if (!check.valid) {
        toast.fire({ icon: 'error', title: `${f.name}: ${check.error}` })
        continue
      }
      accepted.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        preview: URL.createObjectURL(f),
        title: '',
      })
    }
    setPending((prev) => [...prev, ...accepted])
  }

  const removePending = (id) => setPending((prev) => prev.filter((p) => p.id !== id))
  const setPendingTitle = (id, title) =>
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)))

  const uploadAll = async () => {
    if (pending.length === 0) return
    setUploading(true)
    setProgress({ done: 0, total: pending.length })
    let succeeded = 0

    for (let i = 0; i < pending.length; i++) {
      const item = pending[i]
      try {
        const url = await uploadImageToBucket(BUCKET, item.file, { prefix: 'cert-' })
        const { error } = await supabase
          .from('certificates')
          .insert({ Img: url, Title: item.title || null })
        if (error) throw error
        succeeded += 1
      } catch (err) {
        toast.fire({ icon: 'error', title: `${item.file.name}: ${err.message || 'upload failed'}` })
      }
      setProgress({ done: i + 1, total: pending.length })
    }

    setPending([])
    setUploading(false)
    setProgress(null)
    if (succeeded > 0) {
      toast.fire({ icon: 'success', title: `${succeeded} certificate${succeeded > 1 ? 's' : ''} uploaded` })
    }
    fetchCerts()
  }

  const deleteCert = async (cert) => {
    const result = await confirmDelete('This certificate will be permanently deleted.')
    if (!result.isConfirmed) return

    const { error } = await supabase.from('certificates').delete().eq('id', cert.id)
    if (error) {
      toast.fire({ icon: 'error', title: 'Failed to delete certificate' })
      return
    }
    if (cert.Img) deleteImagesFromBucket(BUCKET, [cert.Img])
    toast.fire({ icon: 'success', title: 'Certificate deleted' })
    fetchCerts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#050303] rounded-xl border border-white/15 flex items-center justify-center">
              <Award className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Certificates</h1>
            <p className="text-gray-500 text-xs">
              {loading ? 'Loading...' : `${filteredCerts.length} of ${certs.length} certificates`}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search certificates..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/20 transition-all"
        />
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" /> Upload Certificates
          </h2>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-red-500/60 bg-red-600/10' : 'border-white/12 bg-white/4 hover:border-red-600/35 hover:bg-white/7'
            }`}
          >
            <div className="text-center space-y-2 p-6">
              <div className="w-11 h-11 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto">
                <ImageIcon className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-gray-300">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-600">Multiple files supported · PNG, JPG, WEBP, max 8MB each</p>
            </div>
            <input type="file" accept="image/*" multiple onChange={e => { handleFiles(e.target.files); e.target.value = '' }} className="hidden" />
          </label>

          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {pending.map((item) => (
                  <div key={item.id} className="relative w-28 space-y-1.5">
                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                      <img src={item.preview} alt="preview" className="w-full aspect-[16/11.5] object-cover" />
                      <button
                        type="button"
                        onClick={() => removePending(item.id)}
                        className="absolute top-1 right-1 p-0.5 rounded bg-black/60 hover:bg-black/80 text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      value={item.title}
                      onChange={(e) => setPendingTitle(item.id, e.target.value)}
                      placeholder="Title (optional)"
                      className="w-full bg-[#140505] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-gray-300 placeholder-gray-600 outline-none focus:border-red-600/60"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-500">
                  {pending.length} file{pending.length > 1 ? 's' : ''} ready to upload
                </p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setPending([])} disabled={uploading}
                    className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-500 hover:text-white text-xs transition-colors disabled:opacity-40">
                    Clear
                  </button>
                  <button onClick={uploadAll} disabled={uploading} className="relative group/u">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1d4ed8] to-[#b91c1c] rounded-xl opacity-60 blur group-hover/u:opacity-100 transition duration-300" />
                    <div className="relative flex items-center gap-2 px-4 py-1.5 bg-[#050303] rounded-xl border border-white/10">
                      {uploading ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5 text-red-500" />}
                      <span className="text-xs text-gray-200">
                        {uploading ? `Uploading ${progress?.done ?? 0}/${progress?.total ?? pending.length}...` : 'Upload all'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCerts.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {certs.length === 0 ? 'No certificates yet.' : 'No certificates match your search.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredCerts.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}
