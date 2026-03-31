# Architecture technique — ArtisanConnect

## Vue d'ensemble

ArtisanConnect est une application Next.js 16 (App Router) connectée à Supabase.
L'authentification et la sécurité reposent sur Supabase Auth + Row Level Security (RLS).

## Couches de l'application

### 1. Proxy (proxy.ts)

Point d'entrée de chaque requête HTTP. Responsable de :

- **Refresh de session** : appelle `updateSession()` pour maintenir le cookie Supabase
- **Protection des routes** : redirige les utilisateurs non authentifiés vers `/connexion`
- **Contrôle de rôle** : vérifie que l'utilisateur accède à l'espace de son rôle
- **Redirect onboarding** : si le profil artisan/particulier n'existe pas en BDD, redirige vers la page d'onboarding

> Note : Next.js 16 utilise `proxy.ts` (avec export `proxy`) au lieu de `middleware.ts`.

### 2. Layouts par rôle

Chaque groupe de routes est protégé par un layout serveur qui vérifie le rôle :

- `app/(artisan)/layout.tsx` — vérifie `role = 'artisan'`
- `app/(particulier)/layout.tsx` — vérifie `role = 'particulier'`

C'est une défense en profondeur : le proxy fait déjà la vérification, mais les layouts ajoutent une couche côté serveur.

### 3. Server Actions

Les mutations (inscription, connexion, onboarding) sont gérées par des Server Actions :

- `app/(auth)/actions.ts` — `signUp()`, `signIn()`, `signOut()`
- `app/(artisan)/onboarding/actions.ts` — `completeArtisanOnboarding()`
- `app/(particulier)/onboarding/actions.ts` — `completeParticulierOnboarding()`

Avantages : pas d'API REST à écrire, validation côté serveur, redirect natif.

### 4. Clients Supabase

Trois clients selon le contexte d'exécution :

| Client | Fichier | Usage |
|---|---|---|
| Browser | `lib/supabase/client.ts` | Composants `'use client'` (ex: fetch categories en temps réel) |
| Server | `lib/supabase/server.ts` | Server Components, Server Actions, Route Handlers |
| Proxy | `lib/supabase/middleware.ts` | Uniquement dans `proxy.ts` pour le refresh de session |

## Base de données

### Schéma

```
auth.users (géré par Supabase)
    └── profiles (trigger automatique à l'inscription)
            ├── particuliers (créé à l'onboarding)
            └── artisans (créé à l'onboarding)
                    └── artisan_categories (jonction)
                            └── categories_metiers

profiles ──< projets (via particulier_id)
projets ──< reponses ──< conversations ──< messages
```

### Triggers SQL

| Trigger | Table | Action |
|---|---|---|
| `on_auth_user_created` | `auth.users` | Crée automatiquement un `profile` à l'inscription |
| `enforce_max_reponses` | `reponses` | Bloque l'INSERT si le projet a déjà 3 réponses |
| `on_reponse_accepted` | `reponses` | Crée automatiquement une `conversation` quand une réponse passe en `acceptee` |

### Row Level Security (RLS)

Toutes les tables ont RLS activée. Principes :

- **profiles** : chaque utilisateur ne voit que le sien
- **artisans** : lecture publique (SEO), écriture par le propriétaire
- **projets** : le particulier gère les siens, l'artisan abonné voit les projets ouverts dans son département
- **reponses** : l'artisan gère les siennes, le particulier voit/accepte/refuse
- **conversations + messages** : uniquement les 2 participants

## Conventions

- **Code** : anglais (variables, fonctions, commentaires)
- **UI** : français
- **Tables BDD** : pluriel (`profiles`, `projets`)
- **Clés étrangères** : singulier (`profil_id`, `projet_id`)
- **Composants React** : PascalCase (`SignOutButton.tsx`)
- **Routes Next.js** : kebab-case (`nouveau-projet/page.tsx`)
- **Types TypeScript** : PascalCase + suffixe (`ProjetStatut`, `UserRole`)

## Pages publiques SEO (Phase 5)

### Profil artisan public

- Route : `/artisans/[slug]` — Server Component SSR
- Slug généré automatiquement depuis `nom_entreprise` (trigger SQL)
- `generateMetadata()` pour les meta OG/Twitter dynamiques
- RLS : les artisans sont en lecture publique (`artisans_read_all`)

### Sitemap & Robots

- `app/sitemap.ts` — Sitemap dynamique incluant les pages artisans (query Supabase)
- `app/robots.ts` — Autorise `/` et `/artisans/`, bloque les espaces privés

### Métadonnées SEO

- Layout racine : OG par défaut, Twitter card, `metadataBase`
- Pages artisans : metadata dynamiques via `generateMetadata()`
- Variable : `NEXT_PUBLIC_SITE_URL` pour les URLs absolues
