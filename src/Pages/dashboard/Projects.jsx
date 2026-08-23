import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  Upload,
  FolderGit2,
  X,
  ImageIcon,
  ExternalLink,
  Github,
  Pencil,
  Search,
  Star,
  GripVertical,
  ImagePlus,
} from "lucide-react";
import {
  uploadImageToBucket,
  deleteImagesFromBucket,
  validateImageFile,
} from "../../utils/imageStorage";

const BUCKET = "project-images";

const swalDark = {
  background: "#0a0a1a",
  color: "#e5e7eb",
  confirmButtonColor: "#6366f1",
  cancelButtonColor: "rgba(255,255,255,0.1)",
};

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  ...swalDark,
});

const confirmDelete = (text) =>
  Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    ...swalDark,
  });

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
    />
  </div>
);

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10" />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-full aspect-[16/8] bg-white/5 animate-pulse rounded-xl" />
      <div className="h-4 bg-white/5 animate-pulse rounded-lg w-2/3" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-full" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-4/5" />
      <div className="flex gap-1.5 mt-1">
        <div className="h-5 w-16 bg-white/5 animate-pulse rounded-full" />
        <div className="h-5 w-12 bg-white/5 animate-pulse rounded-full" />
        <div className="h-5 w-20 bg-white/5 animate-pulse rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/8 mt-auto">
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-14 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-16 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const galleryCount = Array.isArray(project.Gallery) ? project.Gallery.length : 0;

  return (
    <Card>
      <div className="p-4 flex flex-col h-full">
        {project.Img && (
          <div className="relative w-full aspect-[16/8] rounded-xl mb-4 border border-white/8 overflow-hidden bg-white/5">
            {!imgLoaded && (
              <div className="w-full h-full animate-pulse bg-white/5" />
            )}
            <img
              src={project.Img}
              alt={project.Title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            />
            {galleryCount > 0 && (
              <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[11px] text-gray-200 border border-white/10">
                <ImagePlus className="w-3 h-3" /> +{galleryCount}
              </span>
            )}
          </div>
        )}
        <h3 className="font-semibold text-white text-sm mb-1">
          {project.Title}
        </h3>
        {project.Description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
            {project.Description}
          </p>
        )}
        {project.TechStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.TechStack.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-white/8">
          <div className="flex gap-2">
            {project.Link && (
              <a
                href={project.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.Github && (
              <a
                href={project.Github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 text-xs transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

let uid = 0;
const nextId = () => `g${Date.now()}_${uid++}`;

// A gallery "item" is either an already-uploaded image ({kind:'existing', url})
// or a freshly-picked file waiting to be uploaded ({kind:'new', file, preview}).
const toGalleryItem = (url) => ({ id: nextId(), kind: "existing", url, preview: url });
const fileToGalleryItem = (file) => ({
  id: nextId(),
  kind: "new",
  file,
  preview: URL.createObjectURL(file),
});

const GalleryThumb = ({ item, index, onRemove, onMakeCover, dragHandlers }) => (
  <div
    className="relative group/thumb w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-grab active:cursor-grabbing"
    draggable
    {...dragHandlers}
  >
    <img src={item.preview} alt="" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/50 transition-colors" />
    <div className="absolute top-1 left-1 p-0.5 rounded bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
      <GripVertical className="w-3 h-3 text-white/80" />
    </div>
    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
      <button
        type="button"
        title="Set as cover"
        onClick={() => onMakeCover(index)}
        className="p-1 rounded bg-indigo-500/80 hover:bg-indigo-500 text-white"
      >
        <Star className="w-3 h-3" />
      </button>
      <button
        type="button"
        title="Remove"
        onClick={() => onRemove(index)}
        className="p-1 rounded bg-red-500/80 hover:bg-red-500 text-white"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
    {item.kind === "new" && (
      <span className="absolute top-1 right-1 text-[9px] px-1 rounded bg-emerald-500/80 text-white">
        new
      </span>
    )}
  </div>
);

const ProjectForm = ({ initial, onSubmit, onCancel, submitLabel = "Save Project" }) => {
  const [form, setForm] = useState({
    Title: initial?.Title || "",
    Description: initial?.Description || "",
    TechStack: Array.isArray(initial?.TechStack)
      ? initial.TechStack.join(", ")
      : initial?.TechStack || "",
    Features: Array.isArray(initial?.Features)
      ? initial.Features.join(", ")
      : initial?.Features || "",
    Link: initial?.Link || "",
    Github: initial?.Github || "",
  });

  // Cover image slot
  const [cover, setCover] = useState(
    initial?.Img
      ? { kind: "existing", url: initial.Img, preview: initial.Img }
      : { kind: null, preview: null },
  );

  // Extra gallery photos
  const [gallery, setGallery] = useState(
    Array.isArray(initial?.Gallery) ? initial.Gallery.filter(Boolean).map(toGalleryItem) : [],
  );

  const [dragIndex, setDragIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null); // {done, total}

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCoverChange = (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const check = validateImageFile(f);
    if (!check.valid) {
      toast.fire({ icon: "error", title: check.error });
      return;
    }
    setCover({ kind: "new", file: f, preview: URL.createObjectURL(f) });
  };

  const handleGalleryFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const accepted = [];
    for (const f of files) {
      const check = validateImageFile(f);
      if (!check.valid) {
        toast.fire({ icon: "error", title: `${f.name}: ${check.error}` });
        continue;
      }
      accepted.push(fileToGalleryItem(f));
    }
    setGallery((prev) => [...prev, ...accepted]);
  };

  const removeGalleryItem = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const makeCover = (index) => {
    setGallery((prev) => {
      const chosen = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      // Old cover (if any) goes back into the gallery so nothing is lost.
      const withOldCover = cover.preview
        ? [{ id: nextId(), kind: cover.kind, url: cover.url, file: cover.file, preview: cover.preview }, ...rest]
        : rest;
      setCover({ kind: chosen.kind, url: chosen.url, file: chosen.file, preview: chosen.preview });
      return withOldCover;
    });
  };

  const onDragStart = (index) => () => setDragIndex(index);
  const onDragOver = (index) => (e) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setGallery((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    setDragIndex(index);
  };
  const onDragEnd = () => setDragIndex(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setProgress(null);
    try {
      // 1. Cover image
      let coverUrl = cover.kind === "existing" ? cover.url : "";
      if (cover.kind === "new") {
        coverUrl = await uploadImageToBucket(BUCKET, cover.file, { prefix: "cover-" });
      }

      // 2. Gallery images (only the "new" ones need uploading)
      const newCount = gallery.filter((g) => g.kind === "new").length;
      let done = 0;
      if (newCount > 0) setProgress({ done: 0, total: newCount });

      const finalGallery = [];
      for (const item of gallery) {
        if (item.kind === "existing") {
          finalGallery.push(item.url);
        } else {
          const url = await uploadImageToBucket(BUCKET, item.file, { prefix: "gallery-" });
          finalGallery.push(url);
          done += 1;
          setProgress({ done, total: newCount });
        }
      }

      await onSubmit({
        Title: form.Title,
        Description: form.Description,
        Img: coverUrl,
        Gallery: finalGallery,
        TechStack: form.TechStack.split(",").map((s) => s.trim()).filter(Boolean),
        Features: form.Features.split(",").map((s) => s.trim()).filter(Boolean),
        Link: form.Link,
        Github: form.Github,
      });
    } catch (err) {
      toast.fire({ icon: "error", title: err.message || "Something went wrong while uploading." });
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <InputField
            label="Project Title"
            value={form.Title}
            onChange={set("Title")}
            placeholder="My Awesome Project"
            required
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Description
          </label>
          <textarea
            value={form.Description}
            onChange={set("Description")}
            placeholder="Short description of the project"
            rows={3}
            className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
          />
        </div>

        <InputField
          label="Tech Stack (comma separated)"
          value={form.TechStack}
          onChange={set("TechStack")}
          placeholder="React, Tailwind, Supabase"
        />
        <InputField
          label="Features (comma separated)"
          value={form.Features}
          onChange={set("Features")}
          placeholder="Auth, Dashboard, Dark mode"
        />
        <InputField
          label="Live Demo Link"
          value={form.Link}
          onChange={set("Link")}
          placeholder="https://..."
        />
        <InputField
          label="Github Link"
          value={form.Github}
          onChange={set("Github")}
          placeholder="https://github.com/..."
        />

        {/* Cover image */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Cover Image
          </label>
          <label className="flex items-center gap-4 w-full bg-[#0d0d22] border border-dashed border-white/15 rounded-xl px-4 py-4 cursor-pointer hover:border-indigo-500/40 hover:bg-white/4 transition-all">
            {cover.preview ? (
              <img
                src={cover.preview}
                className="h-16 w-24 object-cover rounded-lg border border-white/10"
                alt="cover preview"
              />
            ) : (
              <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-300">
                {cover.preview ? "Change cover image" : "Click to upload cover image"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Shown on cards & thumbnails · PNG, JPG, WEBP, max 8MB
              </p>
            </div>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>

        {/* Gallery */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
              Gallery ({gallery.length} photo{gallery.length !== 1 ? "s" : ""})
            </label>
            <label className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleGalleryFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          </div>

          {gallery.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-[#0d0d22] border border-white/10 rounded-xl">
              {gallery.map((item, i) => (
                <GalleryThumb
                  key={item.id}
                  item={item}
                  index={i}
                  onRemove={removeGalleryItem}
                  onMakeCover={makeCover}
                  dragHandlers={{
                    onDragStart: onDragStart(i),
                    onDragOver: onDragOver(i),
                    onDragEnd,
                  }}
                />
              ))}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full min-h-[90px] rounded-xl border border-dashed border-white/12 bg-white/4 hover:border-indigo-500/35 hover:bg-white/7 cursor-pointer transition-all text-center p-4">
              <ImagePlus className="w-5 h-5 text-gray-600 mb-1.5" />
              <p className="text-xs text-gray-400">
                Add extra photos shown on the project detail page
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleGalleryFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          )}
          <p className="text-[11px] text-gray-600">
            Drag thumbnails to reorder · star = set as cover
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={uploading} className="relative group/s">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading
                ? progress
                  ? `Uploading ${progress.done}/${progress.total}...`
                  : "Saving..."
                : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.fire({ icon: "error", title: "Failed to load projects" });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const haystack = [p.Title, p.Description, ...(p.TechStack || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, search]);

  const handleCreate = async (payload) => {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) {
      toast.fire({ icon: "error", title: "Failed to save project" });
      return;
    }
    setShowCreate(false);
    toast.fire({ icon: "success", title: "Project created" });
    fetchProjects();
  };

  const handleEdit = async (payload) => {
    const oldImg = editProject.Img;
    const oldGallery = Array.isArray(editProject.Gallery) ? editProject.Gallery : [];

    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", editProject.id);

    if (error) {
      toast.fire({ icon: "error", title: "Failed to update project" });
      return;
    }

    // Clean up any images that are no longer referenced by this project.
    const stillUsed = new Set([payload.Img, ...(payload.Gallery || [])].filter(Boolean));
    const orphaned = [oldImg, ...oldGallery].filter((url) => url && !stillUsed.has(url));
    if (orphaned.length > 0) deleteImagesFromBucket(BUCKET, orphaned);

    setEditProject(null);
    toast.fire({ icon: "success", title: "Project updated" });
    fetchProjects();
  };

  const deleteProject = async (project) => {
    const result = await confirmDelete(`"${project.Title}" will be permanently deleted.`);
    if (!result.isConfirmed) return;

    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) {
      toast.fire({ icon: "error", title: "Failed to delete project" });
      return;
    }

    const urls = [project.Img, ...(Array.isArray(project.Gallery) ? project.Gallery : [])].filter(Boolean);
    if (urls.length > 0) deleteImagesFromBucket(BUCKET, urls);

    toast.fire({ icon: "success", title: "Project deleted" });
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Projects
            </h1>
            <p className="text-gray-500 text-xs">
              {loading
                ? "Loading..."
                : `${filteredProjects.length} of ${projects.length} projects`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="relative group shrink-0"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#030014] rounded-xl border border-white/10">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-200">New Project</span>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects or tech stack..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Add New Project" onClose={() => setShowCreate(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Save Project"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editProject && (
        <Modal title="Edit Project" onClose={() => setEditProject(null)}>
          <ProjectForm
            initial={editProject}
            onSubmit={handleEdit}
            onCancel={() => setEditProject(null)}
            submitLabel="Update Project"
          />
        </Modal>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <FolderGit2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {projects.length === 0
                ? "No projects yet. Create your first one!"
                : "No projects match your search."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              onEdit={setEditProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
