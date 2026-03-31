# SEO — ArtisanConnect

## Stratégie

Les pages publiques sont rendues en **SSR (Server Components)** pour être indexées par Google :

- `/` — Landing page avec les métiers et tarifs
- `/artisans/[slug]` — Profil artisan publique (une page par artisan)

## Slug artisan

Chaque artisan a un `slug` unique généré automatiquement depuis `nom_entreprise` :

- Migration SQL : `003_add_artisan_slug.sql`
- Fonction `slugify()` : minuscules, accents supprimés, espaces → tirets
- Trigger `BEFORE INSERT` : génère le slug automatiquement
- Trigger `BEFORE UPDATE` : met à jour le slug si `nom_entreprise` change
- Gestion des doublons : suffixe numérique (`-2`, `-3`, etc.)

Exemple : `Dupont Peinture 85` → `/artisans/dupont-peinture-85`

## Métadonnées

### Layout racine (`app/layout.tsx`)

Metadata par défaut pour tout le site :
- `title` avec template : `%s | ArtisanConnect`
- `description` globale
- Open Graph (type, locale, siteName)
- Twitter card (summary_large_image)
- `metadataBase` depuis `NEXT_PUBLIC_SITE_URL`

### Page artisan (`app/artisans/[slug]/page.tsx`)

`generateMetadata()` produit des metadata dynamiques :
- `title` : `{nom_entreprise} — {métiers} | ArtisanConnect`
- `description` : description de l'artisan (160 caractères max)
- Open Graph : url, type=profile, locale=fr_FR
- Twitter card : summary

## Sitemap (`app/sitemap.ts`)

Sitemap dynamique servi à `/sitemap.xml` :
- Pages statiques : `/`, `/connexion`, `/inscription`
- Pages artisans : query Supabase pour lister tous les slugs

## Robots (`app/robots.ts`)

Servi à `/robots.txt` :
- Allow : `/`, `/artisans/`
- Disallow : `/artisan/`, `/particulier/`, `/auth/` (espaces privés)

## Variable d'environnement

```bash
# URL de base du site (pour sitemap, OG tags)
NEXT_PUBLIC_SITE_URL=https://anti-travaux.com
```

Par défaut : `http://localhost:3000`.
