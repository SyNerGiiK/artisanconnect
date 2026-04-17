-- Fix SEC-18: update_artisan_categories doit vérifier l'autorisation et avoir un search_path
CREATE OR REPLACE FUNCTION update_artisan_categories(
  p_artisan_id UUID,
  p_categorie_ids INTEGER[]
) RETURNS void AS $$
BEGIN
  -- VÉRIFICATION D'AUTORISATION (SEC-18)
  IF NOT EXISTS (
    SELECT 1 FROM artisans 
    WHERE id = p_artisan_id AND profil_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- 1. Supprimer les catégories existantes
  DELETE FROM artisan_categories
  WHERE artisan_id = p_artisan_id;

  -- 2. Insérer les nouvelles catégories si le tableau n'est pas vide
  IF array_length(p_categorie_ids, 1) > 0 THEN
    INSERT INTO artisan_categories (artisan_id, categorie_id)
    SELECT p_artisan_id, unnest(p_categorie_ids);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- Fix SEC-21: open_conversation_on_accept doit utiliser search_path = public
CREATE OR REPLACE FUNCTION open_conversation_on_accept()
RETURNS TRIGGER AS $$
DECLARE
  v_particulier_id UUID;
BEGIN
  IF new.statut = 'acceptee' AND OLD.statut = 'en_attente' THEN
    SELECT p.particulier_id INTO v_particulier_id
    FROM projets p WHERE p.id = new.projet_id;

    INSERT INTO conversations (projet_id, artisan_id, particulier_id)
    VALUES (new.projet_id, new.artisan_id, v_particulier_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
