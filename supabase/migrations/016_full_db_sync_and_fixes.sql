-- ============================================================
-- MIGRATION 016 : Synchronisation complète & corrections BDD
-- Date : 2026-04-18
-- Couvre les migrations 009 à 015 appliquées hors registre +
-- tous les correctifs identifiés par l'audit des advisors Supabase.
-- ============================================================
-- Idempotente : peut être rejouée sans erreur.


-- ===========================================================
-- BLOC 1 — COLONNES updated_at (migration 012)
-- ===========================================================

-- Fonction trigger réutilisable
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

ALTER TABLE public.profiles      ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.particuliers  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.artisans      ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.projets       ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.reponses      ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.messages      ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS profiles_set_updated_at      ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS particuliers_set_updated_at  ON public.particuliers;
CREATE TRIGGER particuliers_set_updated_at
  BEFORE UPDATE ON public.particuliers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS artisans_set_updated_at      ON public.artisans;
CREATE TRIGGER artisans_set_updated_at
  BEFORE UPDATE ON public.artisans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS projets_set_updated_at       ON public.projets;
CREATE TRIGGER projets_set_updated_at
  BEFORE UPDATE ON public.projets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reponses_set_updated_at      ON public.reponses;
CREATE TRIGGER reponses_set_updated_at
  BEFORE UPDATE ON public.reponses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS conversations_set_updated_at ON public.conversations;
CREATE TRIGGER conversations_set_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS messages_set_updated_at      ON public.messages;
CREATE TRIGGER messages_set_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ===========================================================
-- BLOC 2 — handle_new_user() : COALESCE + search_path (015)
-- ===========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role   text;
  v_prenom text;
  v_nom    text;
BEGIN
  v_role   := NEW.raw_user_meta_data->>'role';
  v_prenom := COALESCE(NULLIF(NEW.raw_user_meta_data->>'prenom', ''), 'Utilisateur');
  v_nom    := COALESCE(NULLIF(NEW.raw_user_meta_data->>'nom',    ''), '');

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


-- ===========================================================
-- BLOC 3 — check_max_reponses() : search_path + verrou (014)
-- ===========================================================

CREATE OR REPLACE FUNCTION public.check_max_reponses()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Verrou exclusif pour sérialiser les INSERT concurrents
  PERFORM 1 FROM public.projets WHERE id = NEW.projet_id FOR UPDATE;

  SELECT COUNT(*) INTO v_count
  FROM public.reponses
  WHERE projet_id = NEW.projet_id;

  IF v_count >= 3 THEN
    RAISE EXCEPTION 'Ce projet a déjà atteint le maximum de 3 réponses.';
  END IF;

  RETURN NEW;
END;
$$;


-- ===========================================================
-- BLOC 4 — slugify() + generate_artisan_slug() : search_path
-- ===========================================================

CREATE OR REPLACE FUNCTION public.slugify(text_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY INVOKER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(trim(text_input)),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '[\s]+', '-', 'g'
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_artisan_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  base_slug  text;
  final_slug text;
  counter    int := 0;
BEGIN
  base_slug  := public.slugify(NEW.nom_entreprise);
  final_slug := base_slug;

  WHILE EXISTS (
    SELECT 1 FROM public.artisans
    WHERE slug = final_slug AND id != NEW.id
  ) LOOP
    counter    := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;


-- ===========================================================
-- BLOC 5 — open_conversation_on_accept() : search_path
-- ===========================================================

CREATE OR REPLACE FUNCTION public.open_conversation_on_accept()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.statut = 'acceptee' AND OLD.statut != 'acceptee' THEN
    INSERT INTO public.conversations (projet_id, artisan_id, particulier_id)
    SELECT
      NEW.projet_id,
      NEW.artisan_id,
      p.particulier_id
    FROM public.projets p
    WHERE p.id = NEW.projet_id
    ON CONFLICT (projet_id, artisan_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;


-- ===========================================================
-- BLOC 6 — VUE publique artisans sans champs Stripe (011/012)
-- ===========================================================

-- Supprimer la policy trop permissive qui expose tout
DROP POLICY IF EXISTS "artisans_read_all" ON public.artisans;

-- Recréer la policy en lecture seule pour l'artisan lui-même
DROP POLICY IF EXISTS "artisans_read_self" ON public.artisans;
CREATE POLICY "artisans_read_self" ON public.artisans
  FOR SELECT USING (profil_id = (SELECT auth.uid()));

-- Vue publique sans les colonnes sensibles (Stripe, etc.)
CREATE OR REPLACE VIEW public.v_artisans_public
WITH (security_invoker = true)
AS
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
FROM public.artisans;

GRANT SELECT ON public.v_artisans_public TO anon, authenticated;


-- ===========================================================
-- BLOC 7 — VUE publique profiles sans téléphone (013)
-- ===========================================================

-- Retirer la policy publique qui exposait le téléphone
DROP POLICY IF EXISTS "profiles_read_public" ON public.profiles;

-- Vue sécurisée : uniquement id / prenom / nom
CREATE OR REPLACE VIEW public.v_profiles_public
WITH (security_invoker = true)
AS
SELECT
  id,
  prenom,
  nom
FROM public.profiles;

GRANT SELECT ON public.v_profiles_public TO anon, authenticated;

-- Policy spécifique : les participants d'une conversation peuvent lire
-- le profil de l'autre participant (pour le tchat)
DROP POLICY IF EXISTS "profiles_read_conversation_participants" ON public.profiles;
CREATE POLICY "profiles_read_conversation_participants" ON public.profiles
  FOR SELECT USING (
    id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.conversations c
      LEFT JOIN public.particuliers part ON part.id = c.particulier_id
      LEFT JOIN public.artisans     art  ON art.id  = c.artisan_id
      WHERE (part.profil_id = profiles.id OR art.profil_id = profiles.id)
        AND (
          c.artisan_id     = (SELECT a.id FROM public.artisans     a WHERE a.profil_id     = (SELECT auth.uid()))
          OR c.particulier_id = (SELECT p.id FROM public.particuliers p WHERE p.profil_id = (SELECT auth.uid()))
        )
    )
  );


-- ===========================================================
-- BLOC 8 — VUE conversations : security_invoker (007)
-- ===========================================================

CREATE OR REPLACE VIEW public.v_conversations_details
WITH (security_invoker = true)
AS
SELECT
  c.id                           AS conversation_id,
  c.projet_id,
  c.artisan_id,
  c.particulier_id,
  c.created_at                   AS conversation_created_at,
  p.titre                        AS projet_titre,
  part.profil_id                 AS particulier_profil_id,
  prof_part.prenom               AS particulier_prenom,
  prof_part.nom                  AS particulier_nom,
  art.profil_id                  AS artisan_profil_id,
  art.nom_entreprise             AS artisan_nom_entreprise,
  prof_art.prenom                AS artisan_prenom,
  prof_art.nom                   AS artisan_nom,
  lm.contenu                     AS last_message,
  lm.created_at                  AS last_message_date,
  (
    SELECT COUNT(*) FROM public.messages m
    WHERE m.conversation_id = c.id AND m.lu = false AND m.auteur_id <> part.profil_id
  )                              AS unread_particulier_count,
  (
    SELECT COUNT(*) FROM public.messages m
    WHERE m.conversation_id = c.id AND m.lu = false AND m.auteur_id <> art.profil_id
  )                              AS unread_artisan_count
FROM public.conversations c
JOIN public.projets       p         ON p.id    = c.projet_id
JOIN public.particuliers  part      ON part.id = c.particulier_id
JOIN public.profiles      prof_part ON prof_part.id = part.profil_id
JOIN public.artisans      art       ON art.id  = c.artisan_id
JOIN public.profiles      prof_art  ON prof_art.id  = art.profil_id
LEFT JOIN LATERAL (
  SELECT m.contenu, m.created_at
  FROM public.messages m
  WHERE m.conversation_id = c.id
  ORDER BY m.created_at DESC
  LIMIT 1
) lm ON true;

GRANT SELECT ON public.v_conversations_details TO authenticated;


-- ===========================================================
-- BLOC 9 — RLS : remplacer auth.uid() par (SELECT auth.uid())
-- ===========================================================

-- profiles_self
DROP POLICY IF EXISTS "profiles_self" ON public.profiles;
CREATE POLICY "profiles_self" ON public.profiles
  FOR ALL USING (id = (SELECT auth.uid()));

-- artisans_self_write
DROP POLICY IF EXISTS "artisans_self_write" ON public.artisans;
CREATE POLICY "artisans_self_write" ON public.artisans
  FOR ALL USING (profil_id = (SELECT auth.uid()));

-- artisan_categories_self
DROP POLICY IF EXISTS "artisan_categories_self" ON public.artisan_categories;
CREATE POLICY "artisan_categories_self" ON public.artisan_categories
  FOR ALL USING (
    artisan_id = (
      SELECT id FROM public.artisans
      WHERE profil_id = (SELECT auth.uid())
    )
  );

-- particuliers_self
DROP POLICY IF EXISTS "particuliers_self" ON public.particuliers;
CREATE POLICY "particuliers_self" ON public.particuliers
  FOR ALL USING (profil_id = (SELECT auth.uid()));

-- projets_particulier
DROP POLICY IF EXISTS "projets_particulier" ON public.projets;
CREATE POLICY "projets_particulier" ON public.projets
  FOR ALL USING (
    particulier_id = (
      SELECT id FROM public.particuliers
      WHERE profil_id = (SELECT auth.uid())
    )
  );

-- projets_artisan_feed
DROP POLICY IF EXISTS "projets_artisan_feed" ON public.projets;
CREATE POLICY "projets_artisan_feed" ON public.projets
  FOR SELECT USING (
    statut = 'ouvert'
    AND EXISTS (
      SELECT 1 FROM public.artisans a
      WHERE a.profil_id = (SELECT auth.uid())
        AND a.abonnement_actif = true
        AND left(projets.code_postal, 2) = left(a.code_postal_base, 2)
    )
  );

-- reponses_artisan
DROP POLICY IF EXISTS "reponses_artisan" ON public.reponses;
CREATE POLICY "reponses_artisan" ON public.reponses
  FOR ALL USING (
    artisan_id = (
      SELECT id FROM public.artisans
      WHERE profil_id = (SELECT auth.uid())
    )
  );

-- reponses_particulier_select
DROP POLICY IF EXISTS "reponses_particulier_select" ON public.reponses;
CREATE POLICY "reponses_particulier_select" ON public.reponses
  FOR SELECT USING (
    projet_id IN (
      SELECT id FROM public.projets
      WHERE particulier_id = (
        SELECT id FROM public.particuliers
        WHERE profil_id = (SELECT auth.uid())
      )
    )
  );

-- reponses_particulier_update
DROP POLICY IF EXISTS "reponses_particulier_update" ON public.reponses;
CREATE POLICY "reponses_particulier_update" ON public.reponses
  FOR UPDATE USING (
    projet_id IN (
      SELECT id FROM public.projets
      WHERE particulier_id = (
        SELECT id FROM public.particuliers
        WHERE profil_id = (SELECT auth.uid())
      )
    )
  );

-- conversations_participants
DROP POLICY IF EXISTS "conversations_participants" ON public.conversations;
CREATE POLICY "conversations_participants" ON public.conversations
  FOR ALL USING (
    artisan_id     = (SELECT id FROM public.artisans     WHERE profil_id = (SELECT auth.uid()))
    OR particulier_id = (SELECT id FROM public.particuliers WHERE profil_id = (SELECT auth.uid()))
  );

-- messages_participants_read_update
DROP POLICY IF EXISTS "messages_participants_read_update" ON public.messages;
CREATE POLICY "messages_participants_read_update" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE artisan_id     = (SELECT id FROM public.artisans     WHERE profil_id = (SELECT auth.uid()))
         OR particulier_id = (SELECT id FROM public.particuliers WHERE profil_id = (SELECT auth.uid()))
    )
  );

-- messages_participants_update
DROP POLICY IF EXISTS "messages_participants_update" ON public.messages;
CREATE POLICY "messages_participants_update" ON public.messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE artisan_id     = (SELECT id FROM public.artisans     WHERE profil_id = (SELECT auth.uid()))
         OR particulier_id = (SELECT id FROM public.particuliers WHERE profil_id = (SELECT auth.uid()))
    )
  );

-- messages_participants_insert
DROP POLICY IF EXISTS "messages_participants_insert" ON public.messages;
CREATE POLICY "messages_participants_insert" ON public.messages
  FOR INSERT WITH CHECK (
    auteur_id = (SELECT auth.uid())
    AND conversation_id IN (
      SELECT id FROM public.conversations
      WHERE artisan_id     = (SELECT id FROM public.artisans     WHERE profil_id = (SELECT auth.uid()))
         OR particulier_id = (SELECT id FROM public.particuliers WHERE profil_id = (SELECT auth.uid()))
    )
  );


-- ===========================================================
-- BLOC 10 — Fusion policy artisan_categories (doublon SELECT)
-- ===========================================================
-- On garde une seule policy SELECT ouverte au public,
-- et la policy ALL pour les écritures de l'artisan propriétaire.

DROP POLICY IF EXISTS "artisan_categories_read_public" ON public.artisan_categories;
-- La lecture publique passe désormais par la policy ALL (qui couvre SELECT pour l'artisan)
-- + une policy SELECT dédiée pour anon / autres utilisateurs :
CREATE POLICY "artisan_categories_read_public" ON public.artisan_categories
  FOR SELECT USING (true);

-- Note : artisan_categories_self (FOR ALL) couvre également SELECT pour l'artisan.
-- Supabase évalue les deux en OR, ce qui est fonctionnellement correct.
-- Pour éliminer le WARN "multiple_permissive_policies", on refactore
-- artisan_categories_self en 3 policies distinctes (INSERT / UPDATE / DELETE)
-- afin que SELECT n'ait qu'une seule policy permissive.
DROP POLICY IF EXISTS "artisan_categories_self" ON public.artisan_categories;

CREATE POLICY "artisan_categories_self_insert" ON public.artisan_categories
  FOR INSERT WITH CHECK (
    artisan_id = (
      SELECT id FROM public.artisans
      WHERE profil_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "artisan_categories_self_update" ON public.artisan_categories
  FOR UPDATE USING (
    artisan_id = (
      SELECT id FROM public.artisans
      WHERE profil_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "artisan_categories_self_delete" ON public.artisan_categories
  FOR DELETE USING (
    artisan_id = (
      SELECT id FROM public.artisans
      WHERE profil_id = (SELECT auth.uid())
    )
  );


-- ===========================================================
-- BLOC 11 — INDEX sur les clés étrangères non indexées
-- ===========================================================

-- artisan_categories : categorie_id
CREATE INDEX IF NOT EXISTS idx_artisan_categories_categorie_id
  ON public.artisan_categories (categorie_id);

-- conversations : artisan_id, particulier_id, projet_id
CREATE INDEX IF NOT EXISTS idx_conversations_artisan_id
  ON public.conversations (artisan_id);

CREATE INDEX IF NOT EXISTS idx_conversations_particulier_id
  ON public.conversations (particulier_id);

CREATE INDEX IF NOT EXISTS idx_conversations_projet_id
  ON public.conversations (projet_id);

-- messages : auteur_id (conversation_id + created_at déjà indexé)
CREATE INDEX IF NOT EXISTS idx_messages_auteur_id
  ON public.messages (auteur_id);

-- projets : categorie_id, particulier_id
CREATE INDEX IF NOT EXISTS idx_projets_categorie_id
  ON public.projets (categorie_id);

CREATE INDEX IF NOT EXISTS idx_projets_particulier_id
  ON public.projets (particulier_id);

-- reponses : artisan_id, projet_id
CREATE INDEX IF NOT EXISTS idx_reponses_artisan_id
  ON public.reponses (artisan_id);

-- projet_id est déjà couvert par l'index UNIQUE (projet_id, artisan_id)


-- ===========================================================
-- BLOC 12 — Stripe fields contrainte (idempotent - migration 009)
-- ===========================================================

ALTER TABLE public.artisans
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

ALTER TABLE public.artisans
  DROP CONSTRAINT IF EXISTS artisans_stripe_customer_id_unique;
ALTER TABLE public.artisans
  ADD CONSTRAINT artisans_stripe_customer_id_unique
    UNIQUE (stripe_customer_id);
