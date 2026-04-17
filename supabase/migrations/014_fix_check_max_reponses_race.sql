-- ============================================================
-- MIGRATION 014 : Fix race condition check_max_reponses
-- ============================================================
-- BLOQ-5 (audit) : deux INSERT concurrents peuvent tous les deux
-- voir COUNT(*) = 2 puis valider ensemble, laissant 4 réponses
-- sur le projet alors que la règle métier en impose 3 max.
--
-- Correctif : on verrouille explicitement la ligne du projet
-- via SELECT ... FOR UPDATE, ce qui sérialise les INSERTs
-- concurrents sur le même projet_id. On ajoute aussi un
-- search_path figé pour respecter les consignes de 007.

CREATE OR REPLACE FUNCTION check_max_reponses()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Verrou exclusif sur la ligne du projet pour sérialiser les INSERT
  -- concurrents sur ce même projet. Les autres transactions attendront
  -- la fin de celle-ci avant de compter à leur tour.
  PERFORM 1 FROM projets WHERE id = NEW.projet_id FOR UPDATE;

  SELECT COUNT(*) INTO v_count
  FROM reponses
  WHERE projet_id = NEW.projet_id;

  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Ce projet a déjà atteint le maximum de 3 réponses.';
  END IF;

  RETURN NEW;
END;
$$;
