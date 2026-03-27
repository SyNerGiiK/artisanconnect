# PROMPT CLAUDE CODE — Projet "ArtisanConnect" (Anti-Travaux.com)

---

## 🎯 TON RÔLE

Tu es le développeur senior de ce projet. Tu travailles avec un développeur autodidacte qui comprend la logique du code mais n'a pas besoin de théorie ni de leçons. Tu es **franc, direct, structuré**. Tu codes, tu expliques brièvement tes choix, tu n'over-engineeres pas.

Avant chaque session de travail, relis ce fichier pour avoir le contexte complet.

---

## 📌 LE PROJET

**Nom de travail :** ArtisanConnect (nom définitif à valider)

**Mission :** Plateforme SaaS de mise en relation entre particuliers (gratuit) et artisans du bâtiment (abonnement mensuel). Concurrencer Travaux.com en supprimant le modèle toxique de l'achat de "leads" à l'unité.

**Différenciateurs clés :**
- Abonnement fixe : l'artisan paie X€/mois et répond à autant de chantiers qu'il veut dans son secteur — zéro commission, zéro frais par contact
- Maximum 3 artisans par chantier — protection du client contre le harcèlement, protection de l'artisan contre la guerre des prix
- Vérification stricte : SIRET + assurance décennale obligatoires pour les pros
- Anonymat temporaire : le contact du client n'est partagé que via le chat in-app, le numéro ne se débloque qu'avec accord mutuel

**Fondateurs :** Deux artisans (peinture, sols/murs, espaces verts) basés en Vendée (85).

---

## 🗺️ STRATÉGIE DE LANCEMENT

**Lancement ultra-ciblé — ne pas en dévier :**
- Zone géographique : Département 85 (Vendée) uniquement
- Corps de métier : 3 uniquement → `peinture`, `sols-murs`, `espaces-verts`
- Cible artisans : 50 premiers (offre "Fondateurs" à 300€/an à vie)

**Expansion prévue APRÈS validation :** autres départements, autres métiers.

---

## 💰 MODÈLE ÉCONOMIQUE

| Offre | Prix | Note |
|---|---|---|
| Abonnement mensuel | 50 €/mois | Sans engagement |
| Abonnement annuel | 480 €/an (40 €/mois) | **Priorité commerciale — cash immédiat** |
| Offre Fondateurs (50 premiers) | 300 €/an à vie | Pour le lancement |
| Boost ponctuel (V2) | 10-20 €/chantier | Upsell futur |
| Profil Premium (V2) | +15 €/mois | Upsell futur |

**Clients particuliers : toujours gratuit.**

---

## 🛠️ STACK TECHNIQUE

### Décisions définitives — ne pas les remettre en question

| Couche | Technologie | Raison |
|---|---|---|
| Frontend web | **Next.js 14+ (App Router)** avec TypeScript | SEO natif pour les fiches artisans et annonces, routing simple, bon DX |
| Styling | **Tailwind CSS** | Utility-first, rapide, pas de sur-ingénierie |
| Backend / BDD | **Supabase** (PostgreSQL + Auth + Storage + Realtime) | Backend-as-a-Service : 0 serveur à gérer, RLS intégrée, realtime pour le feed et le chat |
| Paiement (V2) | **Stripe** (Subscriptions + Connect) | Standard, DSP2-compliant via Connect pour le cantonnement des fonds |
| IA (V2) | **API OpenAI ou Mistral** via Supabase Edge Functions | Qualification d'annonces, matching sémantique |
| Hébergement app | **Vercel** | Déploiement Next.js natif, tier gratuit généreux |
| Hébergement IA (V2) | **Scaleway** (Managed Inference) | Cloud souverain FR, crédits startup jusqu'à 36 000 € |

### Conventions de code — règles strictes

```
- Langue du code : anglais (variables, fonctions, commentaires)
- Langue de l'UI : français
- Tables BDD : PLURIEL (users, projects, messages)
- Clés étrangères : SINGULIER (user_id, project_id)
- Composants React : PascalCase (ProDashboard.tsx)
- Fonctions utilitaires : camelCase (formatDate.ts)
- Types TypeScript : PascalCase avec suffixe (UserProfile, ProjectStatus)
- Fichiers de route Next.js : kebab-case (pro-dashboard/page.tsx)
- Variables d'environnement : SCREAMING_SNAKE_CASE
```

---

## 🗄️ SCHÉMA DE BASE DE DONNÉES SUPABASE

### Vue d'ensemble des tables

```
auth.users (géré par Supabase)
    └── profiles (extension publique de auth.users)
            ├── particuliers
            └── artisans
                    └── artisan_categories (jonction)
                            └── categories_metiers

profiles ──< projets (via particulier_id)
projets ──< reponses ──< conversations ──< messages
```

### Scripts SQL complets

```sql
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

-- Création automatique du profil à l'inscription
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
-- Seed avec les 3 métiers du MVP
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
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  particulier_id uuid NOT NULL REFERENCES particuliers(id) ON DELETE CASCADE,
  categorie_id int  NOT NULL REFERENCES categories_metiers(id),
  titre        text NOT NULL,
  description  text NOT NULL,
  adresse      text NOT NULL,
  code_postal  text NOT NULL,
  ville        text NOT NULL,
  statut       text NOT NULL DEFAULT 'ouvert'
               CHECK (statut IN ('ouvert', 'en_cours', 'termine', 'annule')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes de feed artisan (filtrage par code_postal + statut)
CREATE INDEX idx_projets_statut_cp ON projets(statut, code_postal);


-- ============================================================
-- TABLE : reponses
-- Candidature d'un artisan sur un projet
-- Statuts : 'en_attente' | 'acceptee' | 'refusee'
-- Règle métier : MAX 3 réponses par projet (enforced en RLS + trigger)
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

-- Trigger : ouvrir automatiquement la conversation à l'acceptation
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

-- Index pour charger les messages d'une conversation dans l'ordre
CREATE INDEX idx_messages_conv_created ON messages(conversation_id, created_at ASC);
```

### Row Level Security (RLS) — règles essentielles

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE particuliers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_metiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reponses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;

-- profiles : chacun voit et modifie uniquement le sien
CREATE POLICY "profiles_self" ON profiles
  USING (id = auth.uid());

-- categories_metiers : lecture publique (pas d'auth requise)
CREATE POLICY "categories_read_all" ON categories_metiers
  FOR SELECT USING (true);

-- artisans : lecture publique des profils, écriture uniquement par le propriétaire
CREATE POLICY "artisans_read_all" ON artisans
  FOR SELECT USING (true);
CREATE POLICY "artisans_self_write" ON artisans
  FOR ALL USING (profil_id = auth.uid());

-- projets : 
--   Particulier : voit et gère ses propres projets
--   Artisan abonné : voit les projets 'ouvert' dans son département (simplification MVP : même 2 premiers chiffres de CP)
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

-- reponses : artisan voit ses réponses, particulier voit les réponses à ses projets
CREATE POLICY "reponses_artisan" ON reponses
  FOR ALL USING (
    artisan_id = (SELECT id FROM artisans WHERE profil_id = auth.uid())
  );

CREATE POLICY "reponses_particulier" ON reponses
  FOR SELECT USING (
    projet_id IN (
      SELECT id FROM projets WHERE particulier_id = (
        SELECT id FROM particuliers WHERE profil_id = auth.uid()
      )
    )
  );

-- Particulier peut accepter/refuser une réponse (UPDATE)
CREATE POLICY "reponses_particulier_update" ON reponses
  FOR UPDATE USING (
    projet_id IN (
      SELECT id FROM projets WHERE particulier_id = (
        SELECT id FROM particuliers WHERE profil_id = auth.uid()
      )
    )
  );

-- conversations et messages : uniquement les 2 participants
CREATE POLICY "conversations_participants" ON conversations
  FOR ALL USING (
    artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
    OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
  );

CREATE POLICY "messages_participants" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE artisan_id    = (SELECT id FROM artisans     WHERE profil_id = auth.uid())
         OR particulier_id = (SELECT id FROM particuliers WHERE profil_id = auth.uid())
    )
  );
```

---

## 📁 STRUCTURE DU PROJET NEXT.JS

```
/
├── app/
│   ├── (auth)/
│   │   ├── connexion/page.tsx
│   │   └── inscription/page.tsx          # Choix du rôle dès l'inscription
│   │
│   ├── (particulier)/
│   │   ├── layout.tsx                    # Guard : rôle = particulier requis
│   │   ├── dashboard/page.tsx            # Mes projets en cours
│   │   └── nouveau-projet/page.tsx       # Formulaire de dépôt de chantier
│   │
│   ├── (artisan)/
│   │   ├── layout.tsx                    # Guard : rôle = artisan + abonnement_actif
│   │   ├── feed/page.tsx                 # Liste des chantiers disponibles
│   │   ├── profil/page.tsx              # Gestion du profil pro
│   │   └── conversations/
│   │       ├── page.tsx                  # Liste des conversations
│   │       └── [id]/page.tsx            # Chat avec un particulier
│   │
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Landing page publique
│
├── components/
│   ├── ui/                               # Composants atomiques (Button, Input, Badge...)
│   ├── auth/                             # Formulaires d'auth
│   ├── projects/                         # Cartes de projet, formulaires
│   └── chat/                             # Composants de messagerie
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Supabase Browser Client
│   │   ├── server.ts                     # Supabase Server Client (SSR)
│   │   └── middleware.ts                 # Refresh de session
│   ├── types/
│   │   └── database.types.ts            # Types générés depuis Supabase
│   └── utils/
│       └── formatters.ts
│
├── middleware.ts                          # Protection des routes par rôle
├── .env.local                            # Variables d'env (jamais committé)
└── supabase/
    └── migrations/                       # Fichiers SQL de migration
        ├── 001_schema_initial.sql
        └── 002_rls_policies.sql
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT REQUISES

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Jamais exposé côté client
SUPABASE_SERVICE_ROLE_KEY=xxxx

# Ajoutées en V2
STRIPE_SECRET_KEY=xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxxx
STRIPE_WEBHOOK_SECRET=xxxx
```

---

## 🚀 PÉRIMÈTRE DU MVP — CE QUI EST DEDANS / DEHORS

### ✅ Dans le MVP (à coder maintenant)

1. **Authentification** : inscription avec choix de rôle (Pro / Particulier), connexion, déconnexion, protection des routes par middleware
2. **Onboarding Pro** : formulaire de complétion du profil artisan (SIRET, nom entreprise, description, code postal, rayon, choix des métiers)
3. **Onboarding Particulier** : formulaire de complétion du profil
4. **Dépôt de projet** (Particulier) : formulaire simple — titre, description, catégorie (parmi les 3), adresse/ville/CP
5. **Feed des chantiers** (Artisan) : liste des projets `ouvert` dans sa zone, filtrés par sa/ses catégorie(s)
6. **Réponse à un chantier** (Artisan) : envoi d'un message initial (déclenche la création de la `reponse`)
7. **Gestion des réponses** (Particulier) : voir les réponses sur ses projets, accepter ou refuser
8. **Messagerie in-app** : chat temps réel entre particulier et artisan une fois la réponse acceptée
9. **Dashboard** (Particulier) : liste de ses projets et leur statut
10. **Profil Artisan** : page publique `/artisans/[slug]` (SEO — important)

### ❌ Hors MVP (V2+)

- Paiement Stripe (l'abonnement est simulé — `abonnement_actif = true` mis manuellement en DB pour les 50 artisans fondateurs)
- Notifications push
- IA (qualification d'annonce, matching, modération)
- Boost ponctuel et profil Premium
- Galerie photos / portfolio artisan
- Système d'avis/notation
- Extension à d'autres départements et métiers

---

## ⚙️ ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

Travailler dans cet ordre strict. Chaque étape doit être fonctionnelle avant de passer à la suivante.

```
Phase 1 — Fondations
  [1] Setup projet Next.js + Tailwind + Supabase
  [2] Migrations SQL (schema + RLS)
  [3] Génération des types TypeScript depuis Supabase
  [4] Middleware de protection des routes

Phase 2 — Auth & Profils
  [5] Pages inscription / connexion
  [6] Formulaire d'onboarding Artisan
  [7] Formulaire d'onboarding Particulier

Phase 3 — Flux principal
  [8] Formulaire de dépôt de projet (Particulier)
  [9] Feed des chantiers (Artisan)
  [10] Répondre à un chantier (Artisan)
  [11] Accepter/Refuser une réponse (Particulier)

Phase 4 — Messagerie
  [12] Chat temps réel (Supabase Realtime)
  [13] Liste des conversations

Phase 5 — Pages publiques SEO
  [14] Page profil artisan publique (/artisans/[slug])
  [15] Landing page
```

---

## 🧠 RÈGLES MÉTIER CRITIQUES À NE JAMAIS OUBLIER

1. **Max 3 réponses par projet** — enforced par trigger SQL ET vérifié côté serveur avant insertion. Ne pas compter sur le front seul.
2. **Un artisan ne peut répondre qu'une fois par projet** — contrainte UNIQUE sur `(projet_id, artisan_id)`.
3. **Seul un artisan avec `abonnement_actif = true` peut voir le feed et répondre** — vérifié en RLS.
4. **La conversation ne s'ouvre que lorsque le particulier accepte une réponse** — géré par trigger SQL.
5. **Le numéro de téléphone du client n'est jamais exposé dans le feed** — il est dans `particuliers`, non visible par la RLS artisan.
6. **Les profils artisans (`/artisans/[slug]`) sont rendus en SSR** pour le SEO Google.

---

## 📋 NOTES LÉGALES (à intégrer dans le produit)

- CGU / CGV : la plateforme est un **intermédiaire**, pas responsable de la qualité des travaux
- RGPD : suppression de compte avec effacement des données personnelles en 1 clic (fonctionnalité obligatoire)
- Mentions légales : à afficher dans le footer
- Médiation de la consommation : obligatoire en B2C France
- Résiliation abonnement en "3 clics" max (loi protection pouvoir d'achat 2023)

---

## 💬 COMMENT TRAVAILLER AVEC MOI

- Je suis le développeur principal. Je veux du **code fonctionnel, bien commenté, prêt à être collé**.
- Propose toujours **une solution complète** pour le fichier demandé, pas des extraits.
- Si tu dois faire un choix d'implémentation, **explique-le en 2 lignes** puis code.
- Si quelque chose dans mes demandes crée un risque (sécurité, performance, dette technique), **dis-le clairement** avant de coder.
- Respecte strictement les **conventions de nommage** définies dans ce document.
- Après chaque livrable, propose-moi **la prochaine étape logique**.
