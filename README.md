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
│   ├── actions.ts              # Server actions : signUp, signIn, signOut
│   ├── layout.tsx              # Layout centré pour les pages auth
│   ├── connexion/page.tsx      # Page de connexion
│   └── inscription/page.tsx    # Page d'inscription (choix du rôle)
├── (artisan)/
│   ├── layout.tsx              # Guard : rôle artisan requis
│   ├── feed/page.tsx           # Liste des chantiers disponibles
│   └── onboarding/
│       ├── page.tsx            # Formulaire de complétion du profil artisan
│       └── actions.ts          # Server action onboarding artisan
├── (particulier)/
│   ├── layout.tsx              # Guard : rôle particulier requis
│   ├── dashboard/page.tsx      # Tableau de bord des projets
│   └── onboarding/
│       ├── page.tsx            # Formulaire de complétion du profil particulier
│       └── actions.ts          # Server action onboarding particulier
├── auth/callback/route.ts      # Callback Supabase (email verification)
├── layout.tsx                  # Root layout
└── page.tsx                    # Landing page

components/
└── auth/
    └── SignOutButton.tsx        # Bouton de déconnexion

lib/
├── supabase/
│   ├── client.ts               # Supabase Browser Client
│   ├── server.ts               # Supabase Server Client (SSR)
│   └── middleware.ts            # updateSession() pour le proxy
└── types/
    └── database.types.ts        # Types TypeScript du schéma DB

proxy.ts                         # Protection des routes + redirect onboarding
supabase/migrations/             # Fichiers SQL de migration
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

## Avancement

- [x] **Phase 1** — Fondations (setup, migrations SQL, types, proxy)
- [x] **Phase 2** — Auth & Profils (inscription, connexion, onboarding)
- [ ] **Phase 3** — Flux principal (dépôt de projet, feed, réponses)
- [ ] **Phase 4** — Messagerie temps réel
- [ ] **Phase 5** — Pages publiques SEO
