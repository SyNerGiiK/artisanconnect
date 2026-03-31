-- ============================================================
-- MIGRATION 003 : Ajout du slug pour les profils artisans publics
-- Requis pour la route /artisans/[slug] (SEO Phase 5)
-- ============================================================

-- Extension pour supprimer les accents (si pas déjà installée)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Fonction utilitaire : convertit un texte en slug URL-friendly
CREATE OR REPLACE FUNCTION slugify(text_input text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(trim(text_input)),
        '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special characters
      ),
      '[\s]+', '-', 'g'              -- Replace spaces with hyphens
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction trigger : génère un slug unique à partir de nom_entreprise
CREATE OR REPLACE FUNCTION generate_artisan_slug()
RETURNS trigger AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter int := 0;
BEGIN
  base_slug := slugify(new.nom_entreprise);
  final_slug := base_slug;

  -- Handle duplicates by appending a counter
  WHILE EXISTS (SELECT 1 FROM artisans WHERE slug = final_slug AND id != new.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  new.slug := final_slug;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Ajouter la colonne slug (nullable d'abord pour le backfill)
ALTER TABLE artisans ADD COLUMN slug text UNIQUE;

-- Backfill : générer les slugs pour les artisans existants
UPDATE artisans SET slug = slugify(nom_entreprise);

-- Gérer les doublons potentiels après backfill
DO $$
DECLARE
  rec RECORD;
  counter int;
BEGIN
  FOR rec IN
    SELECT id, slug, row_number() OVER (PARTITION BY slug ORDER BY id) AS rn
    FROM artisans
    WHERE slug IN (SELECT slug FROM artisans GROUP BY slug HAVING count(*) > 1)
  LOOP
    IF rec.rn > 1 THEN
      UPDATE artisans SET slug = rec.slug || '-' || rec.rn WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

-- Rendre la colonne NOT NULL après le backfill
ALTER TABLE artisans ALTER COLUMN slug SET NOT NULL;

-- Trigger : générer automatiquement le slug à l'insertion
CREATE TRIGGER generate_slug_on_insert
  BEFORE INSERT ON artisans
  FOR EACH ROW
  WHEN (new.slug IS NULL)
  EXECUTE FUNCTION generate_artisan_slug();

-- Trigger : mettre à jour le slug si nom_entreprise change
CREATE TRIGGER update_slug_on_name_change
  BEFORE UPDATE OF nom_entreprise ON artisans
  FOR EACH ROW
  WHEN (old.nom_entreprise IS DISTINCT FROM new.nom_entreprise)
  EXECUTE FUNCTION generate_artisan_slug();
