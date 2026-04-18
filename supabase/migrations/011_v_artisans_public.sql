-- ============================================================
-- MIGRATION 011 : View pour SEO et protection Stripe
-- ============================================================

-- On supprime l'accès public inconditionnel à TOUTE la table artisans
DROP POLICY IF EXISTS "artisans_read_all" ON artisans;

-- L'artisan authentifié peut voir son propre profil complet
-- (pour son dashboard, abonnement Stripe, etc.)
DROP POLICY IF EXISTS "artisans_read_self" ON artisans;
CREATE POLICY "artisans_read_self" ON artisans
  FOR SELECT USING (profil_id = auth.uid());

-- Vue publique exposant uniquement les données sûres (pas de champs Stripe)
-- La colonne updated_at est ajoutée par 012_updated_at_columns.sql qui recrée cette vue.
CREATE OR REPLACE VIEW v_artisans_public AS
SELECT
  id,
  profil_id,
  slug,
  nom_entreprise,
  description,
  siret,
  code_postal_base,
  rayon_km
FROM artisans;

-- La vue est accessible publiquement
GRANT SELECT ON v_artisans_public TO anon, authenticated;
