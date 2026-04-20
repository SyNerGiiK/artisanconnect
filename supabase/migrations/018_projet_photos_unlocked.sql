-- Track whether the particulier has paid to unlock the photo feature on a project
ALTER TABLE projets ADD COLUMN IF NOT EXISTS photos_unlocked boolean NOT NULL DEFAULT false;

-- Storage bucket for project photos (5 MB max, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('projet-photos', 'projet-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "projet_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'projet-photos');

CREATE POLICY "projet_photos_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'projet-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "projet_photos_owner_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'projet-photos' AND auth.uid() IS NOT NULL);
