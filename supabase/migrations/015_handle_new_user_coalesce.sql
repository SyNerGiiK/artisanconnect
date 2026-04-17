-- ============================================================
-- MIGRATION 015 : Durcissement de handle_new_user()
-- ============================================================
-- BLOQ-6 (audit) : si raw_user_meta_data est partiel (ex : OAuth,
-- import, inscription via l'API admin sans passer par le formulaire),
-- l'INSERT échoue silencieusement à cause des NOT NULL sur
-- prenom/nom et de la CHECK sur role. L'utilisateur existe alors
-- dans auth.users sans ligne profiles -> toute l'app casse.
--
-- Correctif :
--   - COALESCE sur prenom/nom (fallback "Utilisateur"/"" pour éviter
--     la violation NOT NULL),
--   - role : si absent ou invalide, on RAISE un message explicite
--     au lieu de laisser la CHECK contrainte retourner une erreur
--     obscure à l'app front.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role    text;
  v_prenom  text;
  v_nom     text;
BEGIN
  v_role   := NEW.raw_user_meta_data->>'role';
  v_prenom := COALESCE(NULLIF(NEW.raw_user_meta_data->>'prenom', ''), 'Utilisateur');
  v_nom    := COALESCE(NULLIF(NEW.raw_user_meta_data->>'nom', ''), '');

  IF v_role IS NULL OR v_role NOT IN ('particulier', 'artisan') THEN
    RAISE EXCEPTION
      'handle_new_user: role invalide ou manquant dans raw_user_meta_data (reçu: %)',
      v_role;
  END IF;

  INSERT INTO public.profiles (id, role, prenom, nom)
  VALUES (NEW.id, v_role, v_prenom, v_nom);

  RETURN NEW;
END;
$$;
