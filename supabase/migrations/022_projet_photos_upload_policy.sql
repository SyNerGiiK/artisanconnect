-- 1. Allow authenticated users to upload files to projet-photos bucket
DROP POLICY IF EXISTS "projet_photos_insert" ON storage.objects;
CREATE POLICY "projet_photos_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'projet-photos' AND auth.role() = 'authenticated');

-- 2. Allow public access to view the photos (so artisans and visitors can see them)
DROP POLICY IF EXISTS "projet_photos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "projet_photos_select_own" ON storage.objects;
CREATE POLICY "projet_photos_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'projet-photos');

-- 3. Just in case artisan-photos isn't public, verify it here.
DROP POLICY IF EXISTS "artisan_photos_public_read" ON storage.objects;
CREATE POLICY "artisan_photos_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'artisan-photos');
