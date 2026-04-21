-- Migration 019: Fix performance and security (RLS & Storage)

-- 1. EXTENSION
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

-- 2. STORAGE BUCKET FIX
DROP POLICY IF EXISTS "projet_photos_public_read" ON storage.objects;
CREATE POLICY "projet_photos_select_own" ON storage.objects
FOR SELECT USING (bucket_id = 'projet-photos' AND auth.uid() = owner);

-- 3. PROFILES RLS FIX
-- Drop "FOR ALL" policy to remove duplicate SELECT evaluation
DROP POLICY IF EXISTS "profiles_self_write" ON profiles;
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_delete_self" ON profiles FOR DELETE USING (id = auth.uid());

-- 4. PROJETS RLS FIX
DROP POLICY IF EXISTS "projets_particulier" ON projets;
DROP POLICY IF EXISTS "projets_artisan_feed" ON projets;

-- Unified SELECT
CREATE POLICY "projets_select_merged" ON projets FOR SELECT USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  OR
  (statut = 'ouvert' AND EXISTS (
    SELECT 1 FROM artisans a
    WHERE a.profil_id = auth.uid()
      AND a.abonnement_actif = true
      AND LEFT(projets.code_postal, 2) = LEFT(a.code_postal_base, 2)
  ))
);

-- Separate WRITE policies for particulier
CREATE POLICY "projets_insert_particulier" ON projets FOR INSERT WITH CHECK (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
);
CREATE POLICY "projets_update_particulier" ON projets FOR UPDATE USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
);
CREATE POLICY "projets_delete_particulier" ON projets FOR DELETE USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
);


-- 5. REPONSES RLS FIX
DROP POLICY IF EXISTS "reponses_artisan" ON reponses;
DROP POLICY IF EXISTS "reponses_particulier_select" ON reponses;
DROP POLICY IF EXISTS "reponses_particulier_update" ON reponses;

-- Unified SELECT
CREATE POLICY "reponses_select_merged" ON reponses FOR SELECT USING (
  artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
  OR
  projet_id IN (SELECT id FROM projets WHERE particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid()))
);

-- Unified UPDATE
CREATE POLICY "reponses_update_merged" ON reponses FOR UPDATE USING (
  artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
  OR
  projet_id IN (SELECT id FROM projets WHERE particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid()))
);

-- Separate INSERT & DELETE (artisan only)
CREATE POLICY "reponses_insert_artisan" ON reponses FOR INSERT WITH CHECK (
  artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
);
CREATE POLICY "reponses_delete_artisan" ON reponses FOR DELETE USING (
  artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
);
