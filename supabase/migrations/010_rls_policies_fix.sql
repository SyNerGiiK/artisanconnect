-- ============================================================
-- MIGRATION 008 : Correction RLS et Politiques de sécurité
-- ============================================================

-- SEC-16: Accès public en lecture pour `artisan_categories` 
-- nécessaire pour le rendu SEO (SSG/SSR public)
CREATE POLICY "artisan_categories_read_public" ON artisan_categories
  FOR SELECT USING (true);

-- SEC-17: Assouplir l'accès en lecture à `profiles` 
-- nécessaire pour lire prenom/nom publiquement et pour le tchat
CREATE POLICY "profiles_read_public" ON profiles
  FOR SELECT USING (true);

-- SEC-26: Renforcer l'insertion des messages pour empêcher l'usurpation d'identité
-- On drop l'ancienne politique FOR ALL et on la scinde
DROP POLICY IF EXISTS "messages_participants" ON messages;

-- Lecture et Mise à jour (inchangées au niveau restriction)
CREATE POLICY "messages_participants_read_update" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
         OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
    )
  );

CREATE POLICY "messages_participants_update" ON messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
         OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
    )
  );

-- Insertion: on force l'auteur_id à être l'utilisateur authentifié
CREATE POLICY "messages_participants_insert" ON messages
  FOR INSERT WITH CHECK (
    auteur_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM conversations
      WHERE artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
         OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
    )
  );
