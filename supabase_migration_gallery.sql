-- ============================================================
-- Migration: multi-photo gallery for projects + certificate titles
-- Run once in Supabase → SQL Editor. Safe to re-run (uses IF NOT EXISTS).
-- ============================================================

-- 1. Projects: add a Gallery column (array of extra photo URLs, in order).
--    The existing "Img" column keeps working as the cover/thumbnail image.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS "Gallery" jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Certificates: optional title/name shown on hover + in the lightbox.
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS "Title" text;

-- ============================================================
-- Storage: allow the admin to delete files (needed for the new
-- "remove old cover / gallery photo / delete project" cleanup).
-- Your original setup only had INSERT + SELECT policies, so
-- deletes were silently rejected before this migration.
-- ============================================================

DROP POLICY IF EXISTS "admin delete project images" ON storage.objects;
CREATE POLICY "admin delete project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "admin delete certificate images" ON storage.objects;
CREATE POLICY "admin delete certificate images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificate-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
