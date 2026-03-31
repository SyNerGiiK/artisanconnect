# ArtisanConnect

Plateforme SaaS de mise en relation entre particuliers et artisans du bâtiment.
Abonnement fixe pour les pros, zéro commission, maximum 3 artisans par chantier.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / BDD | Supabase (PostgreSQL + Auth + Realtime) |
| Hébergement | Vercel |

## Démarrage rapide

### Prérequis

- Node.js 18+
- Un projet [Supabase](https://supabase.com) configuré

### Installation

```bash
npm install
```

### Variables d'environnement

Copier `.env.local.example` ou créer `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
```

### Base de données

Appliquer les migrations SQL dans l'éditeur SQL de Supabase **dans l'ordre** :

1. `supabase/migrations/001_schema_initial.sql` — Tables + triggers
2. `supabase/migrations/002_rls_policies.sql` — Row Level Security

### Lancement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
app/
├── (auth)/
│   ├── actions.ts                  # Server actions : signUp, signIn, signOut
│   ├── layout.tsx                  # Layout centré pour les pages auth
│   ├── connexion/page.tsx          # Page de connexion
│   └── inscription/page.tsx        # Page d'inscription (choix du rôle)
├── artisan/
│   ├── layout.tsx                  # Guard : rôle artisan requis
│   ├── feed/page.tsx               # Feed des chantiers (filtré zone + catégories)
│   ├── repondre/[id]/
│   │   ├── page.tsx                # Formulaire de réponse à un chantier
│   │   └── actions.ts              # Server action : submitReponse
│   ├── conversations/
│   │   ├── page.tsx                # Liste des conversations
│   │   └── [id]/page.tsx           # Chat temps réel avec un particulier
│   └── onboarding/
│       ├── page.tsx                # Formulaire de complétion du profil artisan
│       └── actions.ts              # Server action onboarding artisan
├── particulier/
│   ├── layout.tsx                  # Guard : rôle particulier requis
│   ├── dashboard/page.tsx          # Tableau de bord (liste des projets)
│   ├── nouveau-projet/
│   │   ├── page.tsx                # Formulaire de dépôt de projet
│   │   └── actions.ts              # Server action : createProject
│   ├── projet/[id]/
│   │   ├── page.tsx                # Détail d'un projet + réponses reçues
│   │   └── actions.ts              # Server action : accepter/refuser réponse
│   ├── conversations/
│   │   ├── page.tsx                # Liste des conversations
│   │   └── [id]/page.tsx           # Chat temps réel avec un artisan
│   └── onboarding/
│       ├── page.tsx                # Formulaire de complétion du profil
│       └── actions.ts              # Server action onboarding particulier
├── auth/callback/route.ts          # Callback Supabase (email verification)
├── layout.tsx                      # Root layout
└── page.tsx                        # Landing page

components/
├── auth/
│   └── SignOutButton.tsx            # Bouton de déconnexion
├── chat/
│   ├── ChatRoom.tsx                 # Composant chat temps réel (Supabase Realtime)
│   ├── ChatInput.tsx                # Zone de saisie de message (Enter pour envoyer)
│   ├── ConversationCard.tsx         # Carte de conversation (liste)
│   └── MessageBubble.tsx            # Bulle de message (envoyé / reçu)
├── projects/
│   ├── ProjectCard.tsx              # Carte de projet (dashboard particulier)
│   └── ReponseActions.tsx           # Boutons accepter/refuser une réponse
└── ui/
    └── StatusBadge.tsx              # Badge de statut coloré (ouvert, en_attente...)

lib/
├── supabase/
│   ├── client.ts                   # Supabase Browser Client
│   ├── server.ts                   # Supabase Server Client (SSR)
│   └── middleware.ts               # updateSession() pour le proxy
└── types/
    └── database.types.ts            # Types TypeScript du schéma DB

proxy.ts                             # Protection des routes + redirect onboarding
supabase/migrations/                 # Fichiers SQL de migration
docs/                                # Documentation technique
```

## Flux d'authentification

1. L'utilisateur s'inscrit sur `/inscription` en choisissant son rôle (artisan ou particulier)
2. Supabase crée le user + le trigger insère automatiquement une ligne dans `profiles`
3. L'utilisateur est redirigé vers la page d'onboarding de son rôle
4. Après l'onboarding, accès au dashboard (particulier) ou au feed (artisan)
5. Le proxy vérifie à chaque requête :
   - Authentification (sinon → `/connexion`)
   - Rôle correct (sinon → redirect vers l'espace du bon rôle)
   - Onboarding complété (sinon → `/[role]/onboarding`)

## Flux principal (Phase 3)

### Particulier
1. Dépose un projet via `/particulier/nouveau-projet` (titre, description, catégorie, adresse)
2. Consulte ses projets sur `/particulier/dashboard` avec le nombre de réponses
3. Clique sur un projet → `/particulier/projet/[id]` pour voir les réponses
4. Accepte ou refuse chaque réponse — l'acceptation crée automatiquement une conversation (trigger SQL)

### Artisan
1. Consulte le feed `/artisan/feed` — projets ouverts filtrés par département et catégories
2. Clique "Répondre" → `/artisan/repondre/[id]` pour envoyer un message initial
3. Max 3 réponses par projet (trigger SQL + vérification serveur)
4. Un artisan ne peut répondre qu'une fois par projet (contrainte UNIQUE)

## Messagerie temps réel (Phase 4)

1. Quand un particulier accepte une réponse → le trigger SQL crée automatiquement une `conversation`
2. Les deux participants accèdent au chat via `/[role]/conversations/[id]`
3. Les messages sont envoyés via Supabase (INSERT dans `messages`)
4. Les nouveaux messages arrivent en temps réel via **Supabase Realtime** (postgres_changes)
5. Les messages non lus sont marqués comme lus automatiquement à l'ouverture du chat
6. Envoi optimiste : le message apparaît instantanément côté expéditeur

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — Architecture technique
- [`docs/auth-flow.md`](docs/auth-flow.md) — Flux d'authentification détaillé
- [`docs/project-flow.md`](docs/project-flow.md) — Flux principal (projets, réponses)
- [`docs/messaging.md`](docs/messaging.md) — Messagerie temps réel

## Avancement

- [x] **Phase 1** — Fondations (setup, migrations SQL, types, proxy)
- [x] **Phase 2** — Auth & Profils (inscription, connexion, onboarding)
- [x] **Phase 3** — Flux principal (dépôt de projet, feed, réponses)
- [x] **Phase 4** — Messagerie temps réel
- [ ] **Phase 5** — Pages publiques SEO
