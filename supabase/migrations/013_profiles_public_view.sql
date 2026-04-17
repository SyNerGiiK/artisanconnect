-- ============================================================
-- MIGRATION 013 : Fuite RLS profiles -> vue publique restreinte
-- ============================================================
-- BLOQ-4 (audit) : la policy `profiles_read_public` exposait
-- TOUTES les colonnes de `profiles` (y compris `telephone`) à
-- n'importe qui (anon inclus).
-- Correctif :
--   1. On retire la policy publique.
--   2. On expose uniquement id / prenom / nom via une vue.
--   3. Les utilisateurs authentifiés peuvent lire le profil des
--      participants de leurs conversations (pour le tchat).

-- 1. Retirer la policy trop permissive
DROP POLICY IF EXISTS "profiles_read_public" ON profiles;

-- 2. Vue publique : uniquement les champs non sensibles
CREATE OR REPLACE VIEW v_profiles_public AS
SELECT
  id,
  prenom,
  nom
FROM profiles;

GRANT SELECT ON v_profiles_public TO anon, authenticated;

-- 3. Les utilisateurs authentifiés peuvent lire les profils des
--    autres participants à leurs conversations (pour afficher
--    prenom/nom côté tchat via les jointures PostgREST).
DROP POLICY IF EXISTS "profiles_read_conversation_participants" ON profiles;
CREATE POLICY "profiles_read_conversation_participants" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM conversations c
      LEFT JOIN particuliers p ON p.id = c.particulier_id
      LEFT JOIN artisans    a ON a.id = c.artisan_id
      WHERE (p.profil_id = profiles.id OR a.profil_id = profiles.id)
        AND (
          c.artisan_id     = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
          OR c.particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
        )
    )
  );
