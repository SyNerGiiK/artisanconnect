-- Fonction SQL pour mettre à jour les catégories d'un artisan de manière atomique
CREATE OR REPLACE FUNCTION update_artisan_categories(
  p_artisan_id UUID,
  p_categorie_ids INTEGER[]
) RETURNS void AS $$
BEGIN
  -- 1. Supprimer les catégories existantes
  DELETE FROM artisan_categories
  WHERE artisan_id = p_artisan_id;

  -- 2. Insérer les nouvelles catégories si le tableau n'est pas vide
  IF array_length(p_categorie_ids, 1) > 0 THEN
    INSERT INTO artisan_categories (artisan_id, categorie_id)
    SELECT p_artisan_id, unnest(p_categorie_ids);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
