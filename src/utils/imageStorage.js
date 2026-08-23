import { supabase } from "../supabase";

// ---- Config ----
export const MAX_FILE_SIZE_MB = 8;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Validate a File before it gets anywhere near an upload call.
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: "No file selected." };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type${file.type ? ` (${file.type})` : ""}. Use JPG, PNG, WEBP, or GIF.`,
    };
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `File is too large (${sizeMB.toFixed(1)}MB). Max ${MAX_FILE_SIZE_MB}MB.`,
    };
  }
  return { valid: true };
}

/**
 * Resize + re-encode an image client-side before upload so large phone photos
 * don't bloat Supabase Storage. Animated GIFs are passed through untouched
 * (canvas would flatten them to a single frame).
 */
export function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = {}) {
  return new Promise((resolve) => {
    if (!file.type || file.type === "image/gif") {
      resolve(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            resolve(file);
            return;
          }
          const newName = file.name.replace(
            /\.(png|jpe?g|webp)$/i,
            outputType === "image/png" ? ".png" : ".jpg",
          );
          const compressed = new File([blob], newName, { type: outputType });
          // Only use the compressed version if it's actually smaller.
          resolve(compressed.size < file.size ? compressed : file);
        },
        outputType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Validate -> compress -> upload a single file to a Supabase Storage bucket.
 * Returns the public URL.
 */
export async function uploadImageToBucket(bucket, file, { prefix = "" } = {}) {
  const check = validateImageFile(file);
  if (!check.valid) throw new Error(check.error);

  const compressed = await compressImage(file);
  const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, compressed, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Upload many files sequentially, reporting progress via onProgress(done, total).
 * Returns { urls, errors } — errors holds { file, error } for any file that failed
 * so the rest of the batch can still succeed.
 */
export async function uploadManyImages(bucket, files, { prefix = "", onProgress } = {}) {
  const urls = [];
  const errors = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadImageToBucket(bucket, files[i], { prefix });
      urls.push(url);
    } catch (err) {
      errors.push({ file: files[i], error: err.message || String(err) });
    }
    onProgress?.(i + 1, files.length);
  }
  return { urls, errors };
}

/**
 * Supabase public URLs look like:
 * https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 * Extract <path> so we can call storage.remove() on it.
 */
export function getStoragePathFromUrl(bucket, url) {
  if (!url || typeof url !== "string") return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  try {
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return url.slice(idx + marker.length);
  }
}

/**
 * Best-effort cleanup of one or more files in a bucket. Never throws —
 * a failed cleanup shouldn't block the user's main action.
 */
export async function deleteImagesFromBucket(bucket, urls = []) {
  const paths = urls.map((u) => getStoragePathFromUrl(bucket, u)).filter(Boolean);
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) {
    console.error(`Failed to clean up ${paths.length} file(s) in "${bucket}":`, error.message);
  }
}
