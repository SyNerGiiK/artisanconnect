-- ============================================================
-- MIGRATION 012 : Ajout de updated_at + triggers auto-update
-- ============================================================
-- Corrige la référence à `updated_at` dans les vues SEO / sitemap et
-- permet une synchronisation fiable avec les webhooks Stripe et les
-- revalidations ISR côté Next.js.

-- Fonction réutilisable déclenchée par chaque UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ajout des colonnes (idempotent)
ALTER TABLE profiles       ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE particuliers   ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE artisans       ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE projets        ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE reponses       ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE conversations  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE messages       ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Triggers BEFORE UPDATE (drop puis re-create pour rester idempotent)
DROP TRIGGER IF EXISTS profiles_set_updated_at      ON profiles;
CREATE TRIGGER profiles_set_updated_at      BEFORE UPDATE ON profiles      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS particuliers_set_updated_at  ON particuliers;
CREATE TRIGGER particuliers_set_updated_at  BEFORE UPDATE ON particuliers  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS artisans_set_updated_at      ON artisans;
CREATE TRIGGER artisans_set_updated_at      BEFORE UPDATE ON artisans      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS projets_set_updated_at       ON projets;
CREATE TRIGGER projets_set_updated_at       BEFORE UPDATE ON projets       FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS reponses_set_updated_at      ON reponses;
CREATE TRIGGER reponses_set_updated_at      BEFORE UPDATE ON reponses      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS conversations_set_updated_at ON conversations;
CREATE TRIGGER conversations_set_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS messages_set_updated_at      ON messages;
CREATE TRIGGER messages_set_updated_at      BEFORE UPDATE ON messages      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Maintenant que artisans.updated_at existe, on peut enrichir la vue publique
CREATE OR REPLACE VIEW v_artisans_public AS
SELECT
  id,
  profil_id,
  slug,
  nom_entreprise,
  description,
  siret,
  code_postal_base,
  rayon_km,
  updated_at
FROM artisans;

GRANT SELECT ON v_artisans_public TO anon, authenticated;
