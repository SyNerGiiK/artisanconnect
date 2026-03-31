# Flux d'authentification — ArtisanConnect

## Inscription

```
Utilisateur → /inscription
    │
    ├── Choix du rôle (Particulier / Artisan)
    ├── Saisie : prénom, nom, email, mot de passe
    │
    └── Server Action signUp()
        │
        ├── supabase.auth.signUp() avec metadata { role, prenom, nom }
        ├── Trigger SQL : crée automatiquement une ligne dans `profiles`
        │
        └── Redirect → /[role]/onboarding
```

## Onboarding Artisan

```
/artisan/onboarding
    │
    ├── Saisie : nom entreprise, SIRET, description, CP, rayon, catégories
    │
    └── Server Action completeArtisanOnboarding()
        │
        ├── INSERT dans `artisans` (profil_id = user.id)
        ├── INSERT dans `artisan_categories` (many-to-many)
        │
        └── Redirect → /artisan/feed
```

## Onboarding Particulier

```
/particulier/onboarding
    │
    ├── Saisie : adresse, code postal, ville
    │
    └── Server Action completeParticulierOnboarding()
        │
        ├── INSERT dans `particuliers` (profil_id = user.id)
        │
        └── Redirect → /particulier/dashboard
```

## Connexion

```
Utilisateur → /connexion
    │
    ├── Saisie : email, mot de passe
    │
    └── Server Action signIn()
        │
        ├── supabase.auth.signInWithPassword()
        │
        └── Redirect → / (le proxy redirige vers l'espace du rôle)
```

## Protection des routes (proxy.ts)

À chaque requête, le proxy exécute dans l'ordre :

1. **Refresh session** — renouvelle le cookie Supabase
2. **Auth check** — si route protégée (`/artisan/*` ou `/particulier/*`) et pas de session → redirect `/connexion`
3. **Role check** — si l'utilisateur accède à l'espace du mauvais rôle → redirect vers le bon
4. **Onboarding check** — si pas de record dans `artisans`/`particuliers` → redirect vers onboarding
5. **Auth pages** — si l'utilisateur est déjà connecté et va sur `/connexion` ou `/inscription` → redirect vers son espace

## Callback email (app/auth/callback/route.ts)

Gère la confirmation d'email via Supabase :

```
Email de vérification → /auth/callback?code=xxx
    │
    └── exchangeCodeForSession(code)
        │
        ├── Succès → redirect vers /
        └── Erreur → redirect vers /connexion?error=auth
```
