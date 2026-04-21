-- Migration 020: Artisan features, avis system, and project RLS update

-- 1. Remove postal code limitation from projets SELECT
DROP POLICY IF EXISTS "projets_select_merged" ON projets;
CREATE POLICY "projets_select_merged" ON projets FOR SELECT USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  OR
  (statut = 'ouvert' AND EXISTS (
    SELECT 1 FROM artisans a
    WHERE a.profil_id = auth.uid()
      AND a.abonnement_actif = true
  ))
);

-- 2. Add columns to artisans
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS photos_realisations text[] DEFAULT '{}';
ALTER TABLE artisans ADD COLUMN IF NOT EXISTS assurance_pro boolean DEFAULT false;

-- 3. Create avis table
CREATE TABLE IF NOT EXISTS avis (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    particulier_id uuid NOT NULL REFERENCES particuliers(id) ON DELETE CASCADE,
    artisan_id uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    projet_id uuid NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
    note integer NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(particulier_id, artisan_id, projet_id) -- One review per project part&artisan combi
);

-- RLS for Avis
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "avis_read_public" ON avis FOR SELECT USING (true);

-- A particulier can insert an avis if they own the project and accepted the artisan's response
CREATE POLICY "avis_insert_particulier" ON avis FOR INSERT WITH CHECK (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM reponses r
    WHERE r.projet_id = avis.projet_id
      AND r.artisan_id = avis.artisan_id
      AND r.statut = 'acceptee'
  )
);

-- A particulier can update/delete their own avis
CREATE POLICY "avis_update_particulier" ON avis FOR UPDATE USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
);
CREATE POLICY "avis_delete_particulier" ON avis FOR DELETE USING (
  particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
);

-- 4. Update the public view
DROP VIEW IF EXISTS v_artisans_public;
CREATE OR REPLACE VIEW v_artisans_public AS
SELECT 
    a.id,
    a.profil_id,
    a.slug,
    a.nom_entreprise,
    a.description,
    a.siret,
    a.code_postal_base,
    a.rayon_km,
    a.assurance_pro,
    a.photos_realisations,
    a.updated_at,
    COALESCE(avg(av.note), 0)::numeric(3,1) as note_moyenne,
    count(av.id) as nombre_avis
FROM artisans a
LEFT JOIN avis av ON a.id = av.artisan_id
GROUP BY a.id;
