-- ============================================================
-- MIGRATION 001 : Schéma initial ArtisanConnect
-- ============================================================


-- ============================================================
-- TABLE : profiles
-- Extension publique de auth.users. Pivot central de sécurité.
-- ============================================================
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('particulier', 'artisan')),
  prenom      text NOT NULL,
  nom         text NOT NULL,
  telephone   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Création automatique du profil à l'inscription via le trigger Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, role, prenom, nom)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'nom'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- TABLE : particuliers
-- Données spécifiques au rôle "client"
-- ============================================================
CREATE TABLE particuliers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id   uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  adresse     text,
  code_postal text,
  ville       text
);


-- ============================================================
-- TABLE : artisans
-- Données spécifiques au rôle "pro"
-- ============================================================
CREATE TABLE artisans (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id           uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  siret               text UNIQUE,
  nom_entreprise      text NOT NULL,
  description         text,
  code_postal_base    text NOT NULL,
  rayon_km            int NOT NULL DEFAULT 30,
  abonnement_actif    bool NOT NULL DEFAULT false,
  abonnement_expire_le date
);


-- ============================================================
-- TABLE : categories_metiers
-- Seed avec les 3 métiers du MVP (Vendée — département 85)
-- ============================================================
CREATE TABLE categories_metiers (
  id       serial PRIMARY KEY,
  slug     text NOT NULL UNIQUE,
  libelle  text NOT NULL
);

INSERT INTO categories_metiers (slug, libelle) VALUES
  ('peinture',      'Peinture intérieure / extérieure'),
  ('sols-murs',     'Revêtement sols et murs'),
  ('espaces-verts', 'Espaces verts et jardinage');


-- ============================================================
-- TABLE : artisan_categories
-- Jonction many-to-many artisan <-> métier
-- ============================================================
CREATE TABLE artisan_categories (
  artisan_id   uuid REFERENCES artisans(id) ON DELETE CASCADE,
  categorie_id int  REFERENCES categories_metiers(id) ON DELETE CASCADE,
  PRIMARY KEY (artisan_id, categorie_id)
);


-- ============================================================
-- TABLE : projets
-- Annonce de chantier déposée par un particulier
-- Statuts : 'ouvert' | 'en_cours' | 'termine' | 'annule'
-- ============================================================
CREATE TABLE projets (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  particulier_id uuid NOT NULL REFERENCES particuliers(id) ON DELETE CASCADE,
  categorie_id   int  NOT NULL REFERENCES categories_metiers(id),
  titre          text NOT NULL,
  description    text NOT NULL,
  adresse        text NOT NULL,
  code_postal    text NOT NULL,
  ville          text NOT NULL,
  statut         text NOT NULL DEFAULT 'ouvert'
                 CHECK (statut IN ('ouvert', 'en_cours', 'termine', 'annule')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes de feed artisan (filtrage par statut + code_postal)
CREATE INDEX idx_projets_statut_cp ON projets(statut, code_postal);


-- ============================================================
-- TABLE : reponses
-- Candidature d'un artisan sur un projet
-- Statuts : 'en_attente' | 'acceptee' | 'refusee'
-- Règle métier : MAX 3 réponses par projet (trigger ci-dessous)
-- ============================================================
CREATE TABLE reponses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projet_id       uuid NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  artisan_id      uuid NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  message_initial text NOT NULL,
  statut          text NOT NULL DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente', 'acceptee', 'refusee')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (projet_id, artisan_id) -- Un artisan ne peut répondre qu'une fois par projet
);

-- Trigger : bloquer la 4e réponse sur un projet
CREATE OR REPLACE FUNCTION check_max_reponses()
RETURNS trigger AS $$
BEGIN
  IF (SELECT COUNT(*) FROM reponses WHERE projet_id = new.projet_id) >= 3 THEN
    RAISE EXCEPTION 'Ce projet a déjà atteint le maximum de 3 réponses.';
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_reponses
  BEFORE INSERT ON reponses
  FOR EACH ROW EXECUTE FUNCTION check_max_reponses();


-- ============================================================
-- TABLE : conversations
-- Créée automatiquement quand une réponse est acceptée
-- ============================================================
CREATE TABLE conversations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projet_id      uuid NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  artisan_id     uuid NOT NULL REFERENCES artisans(id),
  particulier_id uuid NOT NULL REFERENCES particuliers(id),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (projet_id, artisan_id)
);

-- Trigger : ouvrir automatiquement la conversation à l'acceptation d'une réponse
CREATE OR REPLACE FUNCTION open_conversation_on_accept()
RETURNS trigger AS $$
DECLARE
  v_particulier_id uuid;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_reponse_accepted
  AFTER UPDATE ON reponses
  FOR EACH ROW EXECUTE FUNCTION open_conversation_on_accept();


-- ============================================================
-- TABLE : messages
-- Messages échangés dans une conversation
-- ============================================================
CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  auteur_id       uuid NOT NULL REFERENCES profiles(id),
  contenu         text NOT NULL,
  lu              bool NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index pour charger les messages d'une conversation dans l'ordre chronologique
CREATE INDEX idx_messages_conv_created ON messages(conversation_id, created_at ASC);
