-- Ajout de la règle de sécurité (RLS) manquante pour la table particuliers
-- Permet à un particulier de créer, lire et modifier ses propres données.

CREATE POLICY "particuliers_self" ON particuliers
  FOR ALL USING (profil_id = auth.uid());
