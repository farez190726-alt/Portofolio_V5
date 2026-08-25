import { useEffect, useMemo, useState } from 'react'
import { supabase } from "../../supabase";
import Swal from 'sweetalert2'
import { Camera, Upload, Trash2, ImageIcon, Plus, Search, X, Heart, Eye } from 'lucide-react'
import {
  uploadImageToBucket,
  deleteImagesFromBucket,
  validateImageFile,
} from '../../utils/imageStorage'

const BUCKET = 'gallery-images'

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
      <div className="w-full aspect-square bg-white/5 animate-pulse" />
    </div>
  </div>
)

const PhotoCard = ({ photo, likeCount, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-white/5 border border-white/12 rounded-2xl overflow-hidden">
        {!imgLoaded && <div className="w-full aspect-square bg-white/5 animate-pulse" />}
        <img
          src={photo.image_url}
          alt={photo.caption || 'Photo'}
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
        />
        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
            {photo.category && (
              <span className="self-start px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/30 text-[10px] text-red-200">
                {photo.category}
              </span>
            )}
            {photo.caption && (
              <p className="text-xs text-white/90 font-medium line-clamp-2">{photo.caption}</p>
            )}
            <div className="flex items-center gap-3 text-[11px] text-gray-300">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {likeCount}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {photo.views || 0}</span>
            </div>
            <button
              onClick={() => onDelete(photo)}
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

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [likeCounts, setLikeCounts] = useState(new Map())
  const [pending, setPending] = useState([]) // [{id, file, preview, caption, category}]
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPhotos = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('gallery_photos').select('*').order('created_at', { ascending: false })
    if (error) toast.fire({ icon: 'error', title: 'Failed to load photos' })
    setPhotos(data || [])

    const { data: likesData } = await supabase.from('photo_likes').select('photo_id')
    const counts = new Map()
    ;(likesData || []).forEach((row) => counts.set(row.photo_id, (counts.get(row.photo_id) || 0) + 1))
    setLikeCounts(counts)

    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [])

  const filteredPhotos = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return photos
    return photos.filter((p) =>
      (p.caption || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
    )
  }, [photos, search])

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
        caption: '',
        category: '',
      })
    }
    setPending((prev) => [...prev, ...accepted])
  }

  const removePending = (id) => setPending((prev) => prev.filter((p) => p.id !== id))
  const setPendingField = (id, field, value) =>
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

  const uploadAll = async () => {
    if (pending.length === 0) return
    setUploading(true)
    setProgress({ done: 0, total: pending.length })
    let succeeded = 0

    for (let i = 0; i < pending.length; i++) {
      const item = pending[i]
      try {
        const url = await uploadImageToBucket(BUCKET, item.file, { prefix: 'gallery-' })
        const { error } = await supabase
          .from('gallery_photos')
          .insert({
            image_url: url,
            caption: item.caption || null,
            category: item.category || 'General',
          })
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
      toast.fire({ icon: 'success', title: `${succeeded} photo${succeeded > 1 ? 's' : ''} uploaded` })
    }
    fetchPhotos()
  }

  const deletePhoto = async (photo) => {
    const result = await confirmDelete('This photo will be permanently deleted.')
    if (!result.isConfirmed) return

    const { error } = await supabase.from('gallery_photos').delete().eq('id', photo.id)
    if (error) {
      toast.fire({ icon: 'error', title: 'Failed to delete photo' })
      return
    }
    if (photo.image_url) deleteImagesFromBucket(BUCKET, [photo.image_url])
    toast.fire({ icon: 'success', title: 'Photo deleted' })
    fetchPhotos()
  }

  const totalLikes = useMemo(() => Array.from(likeCounts.values()).reduce((a, b) => a + b, 0), [likeCounts])
  const totalViews = useMemo(() => photos.reduce((sum, p) => sum + (p.views || 0), 0), [photos])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#050303] rounded-xl border border-white/15 flex items-center justify-center">
              <Camera className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Gallery</h1>
            <p className="text-gray-500 text-xs">
              {loading ? 'Loading...' : `${filteredPhotos.length} of ${photos.length} photos`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Photos', value: photos.length, color: 'text-red-500' },
          { label: 'Total Likes', value: totalLikes, color: 'text-red-500' },
          { label: 'Total Views', value: totalViews, color: 'text-blue-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-3 sm:p-4">
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by caption or category..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/20 transition-all"
        />
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" /> Upload Photos
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
                  <div key={item.id} className="relative w-32 space-y-1.5">
                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                      <img src={item.preview} alt="preview" className="w-full aspect-square object-cover" />
                      <button
                        type="button"
                        onClick={() => removePending(item.id)}
                        className="absolute top-1 right-1 p-0.5 rounded bg-black/60 hover:bg-black/80 text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      value={item.caption}
                      onChange={(e) => setPendingField(item.id, 'caption', e.target.value)}
                      placeholder="Caption (optional)"
                      className="w-full bg-[#140505] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-gray-300 placeholder-gray-600 outline-none focus:border-red-600/60"
                    />
                    <input
                      value={item.category}
                      onChange={(e) => setPendingField(item.id, 'category', e.target.value)}
                      placeholder="Category (e.g. Travel)"
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
      ) : filteredPhotos.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Camera className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {photos.length === 0 ? 'No photos yet.' : 'No photos match your search.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredPhotos.map(photo => (
            <PhotoCard key={photo.id} photo={photo} likeCount={likeCounts.get(photo.id) || 0} onDelete={deletePhoto} />
          ))}
        </div>
      )}
    </div>
  )
}
