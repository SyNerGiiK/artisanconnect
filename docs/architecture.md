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

## Design System

### Thème « Pro Sombre »

Le design system est basé sur le prototype `proto/ArtisanConnect.html` (thème **Pro Sombre**).
Les tokens CSS sont définis dans `app/globals.css` et exposés à Tailwind via `@theme inline`.

| Catégorie | Variables | Exemple |
|---|---|---|
| Surface | `--ac-bg`, `--ac-surface`, `--ac-surface-hover` | `#f1f5f9`, `#ffffff` |
| Texte | `--ac-text`, `--ac-text-sub`, `--ac-text-muted` | `#0f172a`, `#475569` |
| Primary (blue) | `--ac-primary`, `--ac-primary-dark`, `--ac-primary-light` | `#3b82f6`, `#2563eb` |
| Accents | `--ac-green`, `--ac-amber`, `--ac-red` + variants | Statuts, badges |
| Sidebar (navy) | `--ac-nav-bg`, `--ac-nav-text`, `--ac-nav-active` | `#0f172a` |
| Shape | `--ac-radius`, `--ac-radius-sm`, `--ac-radius-lg` | `8px`, `6px`, `12px` |

### Composants UI (`components/ui/`)

| Composant | Fichier | Usage |
|---|---|---|
| `Button` | `Button.tsx` | Variantes: primary, secondary, ghost, green, amber, danger |
| `Card` | `Card.tsx` | Conteneur avec border, shadow, hover optionnel |
| `Input` | `Input.tsx` | Champ texte avec label, focus ring, variantes |
| `Textarea` | `Textarea.tsx` | Zone texte multi-lignes |
| `Avatar` | `Avatar.tsx` | Initiales avec couleur de fond |
| `Tag` | `Tag.tsx` | Pill badge (catégorie, localisation) |
| `StatusBadge` | `StatusBadge.tsx` | Badge statut (ouvert, en_cours, terminé, etc.) |
| `AlertBanner` | `AlertBanner.tsx` | Bannière warning/info/success |
| `EmptyState` | `EmptyState.tsx` | Placeholder quand une liste est vide |
| `Stars` | `Stars.tsx` | Affichage note étoiles |
| `Divider` | `Divider.tsx` | Séparateur horizontal |
| `Skeleton` | `Skeleton.tsx` | Loading placeholder animé |

### Layout Sidebar (`components/layout/Sidebar.tsx`)

- Sidebar fixe (220px) avec fond navy (`--ac-nav-bg`)
- Logo ArtisanConnect, toggle artisan/particulier
- Navigation contextuelle selon le rôle
- Footer avec avatar utilisateur + déconnexion
- Responsive : drawer mobile avec overlay

### Typographie

- **Corps** : DM Sans (Google Fonts)
- **Titres** : DM Sans (weight 700/800)
- **Display** : Playfair Display (optionnel, thème Artisan Chaud)

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
