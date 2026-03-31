# Flux principal — Projets & Réponses

## Dépôt de projet (Particulier)

```
/particulier/nouveau-projet
    │
    ├── Saisie : titre, catégorie (parmi 3), description, adresse, CP, ville
    │
    └── Server Action createProject()
        │
        ├── Vérifie l'auth + récupère le record `particuliers`
        ├── INSERT dans `projets` (statut = 'ouvert')
        │
        └── Redirect → /particulier/dashboard
```

## Dashboard (Particulier)

```
/particulier/dashboard
    │
    ├── Query : projets du particulier + catégorie + réponses
    ├── Affiche : ProjectCard avec statut, nombre de réponses, réponses en attente
    │
    └── Clic sur un projet → /particulier/projet/[id]
```

## Détail d'un projet (Particulier)

```
/particulier/projet/[id]
    │
    ├── Affiche les détails du projet (titre, description, catégorie, lieu, statut)
    ├── Liste les réponses reçues avec :
    │   ├── Nom de l'entreprise + code postal
    │   ├── Description de l'artisan
    │   ├── Message initial de la réponse
    │   └── Statut de la réponse (en_attente / acceptee / refusee)
    │
    ├── Actions sur le projet lui-même :
    │   ├── [J'ai trouvé mon artisan] → Server Action updateProjectStatus('en_cours')
    │   └── [Annuler la demande] → Server Action updateProjectStatus('annule')
    │   (Ces actions retirent l'annonce du Feed Artisan)
    │
    └── Actions sur chaque réponse en_attente :
        ├── [Accepter] → Server Action updateReponseStatus('acceptee')
        │       └── Trigger SQL crée automatiquement une `conversation`
        └── [Refuser] → Server Action updateReponseStatus('refusee')
```

## Feed des chantiers (Artisan)

```
/artisan/feed
    │
    ├── Vérifie l'auth + récupère le record `artisans` + catégories
    ├── Query : projets 'ouvert' filtrés par :
    │   ├── Département (2 premiers chiffres du CP — via RLS)
    │   ├── Abonnement actif (via RLS)
    │   └── Catégories de l'artisan (filtre client-side)
    │
    ├── Pour chaque projet, affiche :
    │   ├── Titre, description, catégorie, lieu, date
    │   ├── Nombre de réponses / 3
    │   └── Bouton "Répondre" (ou état : déjà répondu / complet)
    │
    └── Clic "Répondre" → /artisan/repondre/[id]
```

## Répondre à un chantier (Artisan)

```
/artisan/repondre/[id]
    │
    ├── Affiche un résumé du projet (titre, description, catégorie, lieu)
    ├── Formulaire : message initial (texte libre)
    │
    └── Server Action submitReponse()
        │
        ├── Vérifie l'auth + récupère le record `artisans`
        ├── Vérifie que l'abonnement est actif
        ├── Vérifie côté serveur : max 3 réponses par projet
        ├── INSERT dans `reponses` (statut = 'en_attente')
        │   └── Contrainte UNIQUE (projet_id, artisan_id) empêche les doublons
        │
        └── Redirect → /artisan/feed
```

## Règles métier appliquées

| Règle | Enforcement |
|---|---|
| Max 3 réponses par projet | Trigger SQL `enforce_max_reponses` + vérification serveur dans `submitReponse()` |
| 1 artisan = 1 réponse par projet | Contrainte UNIQUE `(projet_id, artisan_id)` + gestion de l'erreur `23505` |
| Abonnement actif requis | RLS sur `projets` + vérification serveur dans `submitReponse()` |
| Conversation auto à l'acceptation | Trigger SQL `on_reponse_accepted` crée une ligne dans `conversations` |
| Filtrage par zone | RLS compare les 2 premiers chiffres du CP artisan vs projet |
| Téléphone client protégé | Jamais exposé — données dans `particuliers`, non visible via RLS artisan |

## Composants

### ProjectCard
Carte cliquable affichant un projet avec :
- Titre + badge de statut
- Description (tronquée à 2 lignes)
- Catégorie, ville, date
- Compteur de réponses (total, en attente, acceptées)

### ReponseActions
Boutons "Accepter" / "Refuser" pour chaque réponse en attente.
Appelle la Server Action `updateReponseStatus()` avec `revalidatePath()` pour rafraîchir la page.

### StatusBadge
Badge coloré pour les statuts de projets et réponses :
- `ouvert` → vert
- `en_cours` → bleu
- `termine` → gris
- `annule` → rouge
- `en_attente` → jaune
- `acceptee` → vert
- `refusee` → rouge
