-- ============================================================
-- MIGRATION 002 : Row Level Security (RLS)
-- ============================================================
-- Principe : chaque utilisateur ne voit et ne modifie que les données
-- auxquelles il a le droit d'accéder selon son rôle.
-- ============================================================


-- Activer RLS sur toutes les tables métier
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE particuliers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reponses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- profiles : chaque utilisateur voit et modifie uniquement le sien
-- ============================================================
CREATE POLICY "profiles_self" ON profiles
  USING (id = auth.uid());


-- ============================================================
-- categories_metiers : lecture publique (pas d'auth requise)
-- ============================================================
CREATE POLICY "categories_read_all" ON categories_metiers
  FOR SELECT USING (true);


-- ============================================================
-- artisans
--   - Lecture publique des profils (pour les pages SEO)
--   - Écriture uniquement par le propriétaire du profil
-- ============================================================
CREATE POLICY "artisans_read_all" ON artisans
  FOR SELECT USING (true);

CREATE POLICY "artisans_self_write" ON artisans
  FOR ALL USING (profil_id = auth.uid());


-- ============================================================
-- artisan_categories : l'artisan gère ses propres catégories
-- ============================================================
CREATE POLICY "artisan_categories_self" ON artisan_categories
  FOR ALL USING (
    artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
  );


-- ============================================================
-- projets
--   - Particulier : voit et gère ses propres projets
--   - Artisan abonné : voit les projets 'ouvert' dans son département
--     (MVP : même 2 premiers chiffres de CP)
-- ============================================================
CREATE POLICY "projets_particulier" ON projets
  FOR ALL USING (
    particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  );

CREATE POLICY "projets_artisan_feed" ON projets
  FOR SELECT USING (
    statut = 'ouvert'
    AND EXISTS (
      SELECT 1 FROM artisans a
      WHERE a.profil_id = auth.uid()
        AND a.abonnement_actif = true
        AND LEFT(projets.code_postal, 2) = LEFT(a.code_postal_base, 2)
    )
  );


-- ============================================================
-- reponses
--   - Artisan : voit et gère ses propres réponses (INSERT + SELECT)
--   - Particulier : voit les réponses sur ses projets (SELECT)
--   - Particulier : peut accepter ou refuser une réponse (UPDATE)
-- ============================================================
CREATE POLICY "reponses_artisan" ON reponses
  FOR ALL USING (
    artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
  );

CREATE POLICY "reponses_particulier_select" ON reponses
  FOR SELECT USING (
    projet_id IN (
      SELECT id FROM projets WHERE particulier_id = (
        SELECT id FROM particuliers WHERE profil_id = auth.uid()
      )
    )
  );

CREATE POLICY "reponses_particulier_update" ON reponses
  FOR UPDATE USING (
    projet_id IN (
      SELECT id FROM projets WHERE particulier_id = (
        SELECT id FROM particuliers WHERE profil_id = auth.uid()
      )
    )
  );


-- ============================================================
-- conversations : uniquement les 2 participants (artisan + particulier)
-- ============================================================
CREATE POLICY "conversations_participants" ON conversations
  FOR ALL USING (
    artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
    OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  );


-- ============================================================
-- messages : uniquement les participants de la conversation
-- ============================================================
CREATE POLICY "messages_participants" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
         OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
    )
  );
