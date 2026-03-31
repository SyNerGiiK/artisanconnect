# ArtisanConnect — État du projet

**Date** : 31 Mars 2026
**Branch principale** : `main`
**Modèle active** : Claude Haiku 4.5

---

## 📋 Vue d'ensemble

**ArtisanConnect** est une plateforme SaaS de mise en relation entre **particuliers** (gratuit) et **artisans du bâtiment** (abonnement fixe).

**Différenciation clé** :
- Abonnement fixe 50€/mois (ou 480€/an) — zéro commission
- Max 3 artisans par chantier — protection clients
- Vérification SIRET + assurance décennale (V2)
- Anonymat temporaire — contact via chat in-app

**Lancement** : Vendée (85) uniquement, 3 métiers (peinture, sols-murs, espaces-verts), 50 artisans fondateurs à 300€/an à vie.

---

## 🛠️ Stack technique

| Couche | Tech | Version |
|---|---|---|
| Frontend | Next.js | 16.2.1 (App Router) |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Backend / BDD | Supabase | PostgreSQL + Auth + Realtime |
| Hébergement app | Vercel | ✅ |
| Paiement (V2) | Stripe | À faire |
| IA (V2) | OpenAI / Mistral | À faire |

---

## ✅ Phases terminées

### Phase 1 — Fondations ✅
**Commit** : `9804a03` (Initial commit from Create Next App)

**Fichiers clés créés** :
- `proxy.ts` — Protection des routes par rôle (ancien middleware.ts Next.js 16)
- `lib/supabase/client.ts` — Browser Client
- `lib/supabase/server.ts` — Server Client SSR
- `lib/supabase/middleware.ts` — updateSession()
- `lib/types/database.types.ts` — Types TS du schéma (9 tables)
- `supabase/migrations/001_schema_initial.sql` — Tables + triggers SQL
- `supabase/migrations/002_rls_policies.sql` — Row Level Security

**Règles métier codifiées** :
- Trigger `enforce_max_reponses` : max 3 réponses/projet
- Trigger `on_reponse_accepted` : crée une conversation à l'acceptation
- RLS : artisan voit uniquement les projets ouverts de son département
- RLS : téléphone client jamais exposé au feed artisan

**PR** : [#1 Phase 1](https://github.com/SyNerGiiK/artisanconnect/pull/1)

---

### Phase 2 — Auth & Profils ✅
**Commit** : `ef1530a` feat: Phase 2 — Auth & Profils

**Fichiers créés** :
- `app/(auth)/actions.ts` — signUp, signIn, signOut (Server Actions)
- `app/(auth)/inscription/page.tsx` — Inscription avec choix de rôle
- `app/(auth)/connexion/page.tsx` — Connexion email + password
- `app/(auth)/layout.tsx` — Layout centré pour les pages auth
- `app/auth/callback/route.ts` — Callback Supabase pour vérification email
- `app/artisan/onboarding/page.tsx` — Formulaire profil artisan
- `app/artisan/onboarding/actions.ts` — Server Action onboarding artisan
- `app/particulier/onboarding/page.tsx` — Formulaire profil particulier
- `app/particulier/onboarding/actions.ts` — Server Action onboarding particulier
- `app/artisan/layout.tsx` — Guard layout (rôle = artisan)
- `app/particulier/layout.tsx` — Guard layout (rôle = particulier)
- `components/auth/SignOutButton.tsx` — Bouton déconnexion
- `docs/auth-flow.md` — Flux d'authentification détaillé

**Flux** :
1. Inscription → choix du rôle (artisan/particulier)
2. Trigger SQL crée automatiquement un profil
3. Redirect vers onboarding du rôle
4. Server Action enregistre les données spécifiques au rôle
5. Redirect vers le dashboard/feed

**Proxy** : Vérifie à chaque requête :
- Authentification (sinon → `/connexion`)
- Rôle correct (sinon → redirect vers le bon espace)
- Onboarding complété (sinon → `/[role]/onboarding`)

**PR** : [#2 Phase 2](https://github.com/SyNerGiiK/artisanconnect/pull/2)

---

### Phase 3 — Flux principal ✅
**Commit** : `9678b9b` feat: Phase 3 — Flux principal (projets, feed, réponses)

**Particulier — Dépôt de projet** :
- `app/particulier/nouveau-projet/page.tsx` — Formulaire complet
- `app/particulier/nouveau-projet/actions.ts` — createProject() Server Action
- Saisie : titre, catégorie (3 choix), description, adresse, CP, ville
- Redirect vers dashboard

**Particulier — Dashboard** :
- `app/particulier/dashboard/page.tsx` — Liste des projets
- Query : projets + catégorie + réponses
- ProjectCard affiche : statut, titre, catégorie, lieu, compteur réponses

**Particulier — Détail projet** :
- `app/particulier/projet/[id]/page.tsx` — Page détail
- Affiche les réponses reçues (artisan, message initial, statut)
- `app/particulier/projet/[id]/actions.ts` — updateReponseStatus() pour accepter/refuser
- Boutons Accepter / Refuser (trigger SQL crée la conversation)

**Artisan — Feed** :
- `app/artisan/feed/page.tsx` — Liste des chantiers disponibles
- Query RLS : projets 'ouvert' filtrés par département + catégories artisan
- Affiche : titre, description, nombre de réponses, statut
- Bouton "Répondre" (ou état : déjà répondu / complet)

**Artisan — Répondre** :
- `app/artisan/repondre/[id]/page.tsx` — Formulaire de réponse
- `app/artisan/repondre/[id]/actions.ts` — submitReponse() Server Action
- Vérifications serveur : max 3 réponses/projet, abonnement actif, pas de doublon
- INSERT dans `reponses` (statut = 'en_attente')

**Composants partagés** :
- `components/projects/ProjectCard.tsx` — Carte projet cliquable
- `components/projects/ReponseActions.tsx` — Boutons accepter/refuser
- `components/ui/StatusBadge.tsx` — Badge coloré (ouvert, en_attente, acceptee, etc.)

**Documentation** :
- `docs/project-flow.md` — Flux détaillé projets/réponses + règles métier

**PR** : [#3 Phase 3](https://github.com/SyNerGiiK/artisanconnect/pull/3)

---

### Phase 4 — Messagerie temps réel ✅
**Commit** : `87921e5` feat: Phase 4 — Messagerie temps réel

**Artisan — Conversations** :
- `app/artisan/conversations/page.tsx` — Liste des conversations
- Query : conversations filtrées par artisan_id
- Pour chaque : dernier message, date, badge non-lus
- Trie par date du dernier message

**Artisan — Chat** :
- `app/artisan/conversations/[id]/page.tsx` — Page du chat
- Construit la map des participants (id → prenom/nom)
- Render composant ChatRoom

**Particulier — Conversations** :
- `app/particulier/conversations/page.tsx` — Liste des conversations
- Affiche nom d'entreprise de l'artisan (au lieu du prénom/nom)
- Même logique que artisan

**Particulier — Chat** :
- `app/particulier/conversations/[id]/page.tsx` — Page du chat
- Même logique que artisan

**Composants chat** :
- `components/chat/ChatRoom.tsx` — Composant principal avec Realtime
  - Fetch initial des messages
  - Subscribe à postgres_changes (INSERT sur messages)
  - Envoi optimiste (UUID local, remplacé par version serveur)
  - Marque les messages non-lus comme lus
  - Auto-scroll vers le bas
- `components/chat/MessageBubble.tsx` — Bulle de message (bleu = envoyé, gris = reçu)
- `components/chat/ChatInput.tsx` — Zone de saisie (Enter = envoyer, Shift+Enter = saut de ligne)
- `components/chat/ConversationCard.tsx` — Carte conversation (liste) avec avatar, dernier message, badge

**Navigation** :
- Bouton "Messages" ajouté dans `/artisan/feed`
- Bouton "Messages" ajouté dans `/particulier/dashboard`

**Documentation** :
- `docs/messaging.md` — Architecture Realtime, composants, config Supabase, sécurité

**⚠️ Prérequis** : Activer Realtime sur la table `messages` dans Supabase :
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

**PR** : [#4 Phase 4](https://github.com/SyNerGiiK/artisanconnect/pull/4)

---

## ✅ Phase 5 — Pages publiques SEO ✅

**Commit** : `TBD` feat: Phase 5 — Pages publiques SEO

**Migration SQL** :
- `supabase/migrations/003_add_artisan_slug.sql` — Ajout colonne `slug` (UNIQUE, NOT NULL) à `artisans`, trigger auto-génération, backfill

**Page profil artisan public** :
- `app/artisans/[slug]/page.tsx` — Server Component SSR
  - Query : artisan par slug → info + profil + catégories
  - Affiche : avatar initiale, nom entreprise, description, métiers (badges), zone, SIRET
  - `generateMetadata()` : title, description, OG, Twitter dynamiques
  - CTA « Demander un devis gratuit »
  - Design premium : gradient header, glassmorphism card

**Landing page** :
- `app/page.tsx` — Remplace le placeholder Next.js
  - Hero section avec value prop et 2 CTA
  - Section « Comment ça marche » (3 étapes)
  - Section « Pour les particuliers » (gratuit, avantages)
  - Section « Pour les artisans » (abonnement fixe, pas de commission)
  - Section « Nos métiers » (3 cartes, query dynamique Supabase)
  - Section « Tarifs artisans » (mensuel, annuel, fondateurs)
  - Footer avec liens légaux

**SEO** :
- `app/sitemap.ts` — Sitemap dynamique (pages statiques + artisans)
- `app/robots.ts` — Allow `/`, `/artisans/`, Disallow espaces privés
- `app/layout.tsx` — Metadata enrichies (OG, Twitter, metadataBase)

**Documentation** :
- `docs/seo.md` — Documentation SEO (slug, metadata, sitemap, robots)
- `docs/architecture.md` — Section SEO ajoutée

**PR** : [#5 Phase 5](https://github.com/SyNerGiiK/artisanconnect/pull/5)

---

## 📊 État de la base de données

### Tables créées

| Table | Colonnes | Statut |
|---|---|---|
| `profiles` | id, role, prenom, nom, telephone, created_at | ✅ |
| `particuliers` | id, profil_id, adresse, code_postal, ville | ✅ |
| `artisans` | id, profil_id, **slug**, siret, nom_entreprise, description, code_postal_base, rayon_km, abonnement_actif, abonnement_expire_le | ✅ |
| `categories_metiers` | id, slug, libelle (seed: peinture, sols-murs, espaces-verts) | ✅ |
| `artisan_categories` | artisan_id, categorie_id (many-to-many) | ✅ |
| `projets` | id, particulier_id, categorie_id, titre, description, adresse, code_postal, ville, statut (ouvert, en_cours, termine, annule), created_at | ✅ |
| `reponses` | id, projet_id, artisan_id, message_initial, statut (en_attente, acceptee, refusee), created_at | ✅ |
| `conversations` | id, projet_id, artisan_id, particulier_id, created_at | ✅ |
| `messages` | id, conversation_id, auteur_id, contenu, lu, created_at | ✅ |

### Triggers SQL

| Trigger | Table | Action | Statut |
|---|---|---|---|
| `on_auth_user_created` | auth.users | Crée automatiquement un profil | ✅ |
| `enforce_max_reponses` | reponses | Bloque l'INSERT si projet a 3 réponses | ✅ |
| `on_reponse_accepted` | reponses | Crée une conversation à l'acceptation | ✅ |
| `generate_slug_on_insert` | artisans | Génère le slug depuis nom_entreprise à l'insertion | ✅ |
| `update_slug_on_name_change` | artisans | Met à jour le slug si nom_entreprise change | ✅ |

### Row Level Security

Toutes les tables ont RLS activée :
- `profiles` : chaque user voit/modifie le sien
- `artisans` : lecture publique, write par propriétaire
- `projets` : particulier gère les siens, artisan voit les ouverts de son dept
- `reponses` : artisan gère les siennes, particulier accepte/refuse
- `conversations` : uniquement les 2 participants
- `messages` : uniquement les participants

---

## 🔐 Variables d'environnement

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

Stocker dans `.env.local` (jamais committer).

---

## 📁 Structure du projet

```
app/
├── (auth)/
│   ├── actions.ts              # signUp, signIn, signOut
│   ├── layout.tsx
│   ├── connexion/page.tsx
│   └── inscription/page.tsx
├── artisan/
│   ├── layout.tsx              # Guard rôle
│   ├── feed/page.tsx           # Feed chantiers
│   ├── repondre/[id]/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── conversations/
│   │   ├── page.tsx            # Liste conversations
│   │   └── [id]/page.tsx       # Chat
│   └── onboarding/
│       ├── page.tsx
│       └── actions.ts
├── particulier/
│   ├── layout.tsx              # Guard rôle
│   ├── dashboard/page.tsx
│   ├── nouveau-projet/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── projet/[id]/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── conversations/
│   │   ├── page.tsx            # Liste conversations
│   │   └── [id]/page.tsx       # Chat
│   └── onboarding/
│       ├── page.tsx
│       └── actions.ts
├── auth/callback/route.ts      # Callback email Supabase
├── layout.tsx
├── page.tsx                    # Landing (TODO Phase 5)
└── artisans/[slug]/page.tsx    # Profil artisan public (TODO Phase 5)

components/
├── auth/
│   └── SignOutButton.tsx
├── chat/
│   ├── ChatRoom.tsx
│   ├── ChatInput.tsx
│   ├── ConversationCard.tsx
│   └── MessageBubble.tsx
├── projects/
│   ├── ProjectCard.tsx
│   └── ReponseActions.tsx
└── ui/
    └── StatusBadge.tsx

lib/
├── supabase/
│   ├── client.ts               # Browser Client
│   ├── server.ts               # Server Client
│   └── middleware.ts           # updateSession()
└── types/
    └── database.types.ts       # Types du schéma

docs/
├── architecture.md             # Vue d'ensemble technique
├── auth-flow.md                # Flux authentification
├── project-flow.md             # Flux projets/réponses
└── messaging.md                # Messagerie temps réel

proxy.ts                         # Protection routes
.env.local                       # Variables (jamais committer)
```

---

## 🎯 Conventions de code

**Strictes** — Respecter pour la cohérence :

- **Code** : anglais (variables, fonctions, commentaires)
- **UI** : français
- **Tables BDD** : PLURIEL (`users`, `projets`)
- **Clés étrangères** : SINGULIER (`user_id`, `projet_id`)
- **Composants React** : PascalCase (`ProjectCard.tsx`)
- **Fonctions utilitaires** : camelCase (`formatDate.ts`)
- **Routes Next.js** : kebab-case (`nouveau-projet/page.tsx`)
- **Types TS** : PascalCase + suffixe (`Projet`, `ReponseStatut`)

---

## ✨ Fonctionnalités MVP (ce qui marche)

✅ **Inscription / Connexion** — choix de rôle, auth Supabase
✅ **Onboarding** — profils artisan (SIRET, métiers, zone) et particulier
✅ **Dépôt de projet** — form complet, création en BDD
✅ **Feed artisans** — projets filtrés par zone et catégories
✅ **Réponses** — artisan répond, max 3/projet, 1 réponse/artisan/projet
✅ **Gestion réponses** — particulier accepte/refuse
✅ **Messagerie** — chat temps réel via Supabase Realtime
✅ **Listes conversations** — triées par dernier message, badge non-lus

---

## 🚀 Fonctionnalités V2 (hors MVP)

❌ **Paiement Stripe** — abonnement, gestion factures
❌ **Photos/portfolio** — Upload Storage Supabase
❌ **Avis/notation** — Système d'avis
❌ **IA** — Qualification annonces, matching sémantique
❌ **Boost ponctuel** — Upsell
❌ **Profil Premium** — Upsell
❌ **Notifications push** — Engagement
❌ **Expansion** — Autres départements, métiers

---

## 🔗 Pour reprendre le travail

1. **Lancer le serveur** :
   ```bash
   npm install
   npm run dev
   ```

2. **Activer Realtime** (si Phase 4 mergée) :
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
   ```

3. **Créer `.env.local`** :
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxx
   ```

4. **Phase suivante** : Phase 5 — Pages publiques SEO
   - Profil artisan `/artisans/[slug]` (SSR)
   - Landing page `/`
   - Sitemap + robots.txt

---

## 📝 Derniers commits

| Hash | Message | PR |
|---|---|---|
| `87921e5` | feat: Phase 4 — Messagerie temps réel | #4 |
| `9678b9b` | feat: Phase 3 — Flux principal (projets, feed, réponses) | #3 |
| `ef1530a` | feat: Phase 2 — Auth & Profils | #2 |
| `9804a03` | feat: Phase 1 — Fondations | #1 |

---

## ℹ️ Notes importantes

- **Next.js 16** : Utilise `proxy.ts` (pas `middleware.ts`)
- **Tailwind v4** : Pas de `tailwind.config.js`, config via CSS
- **RLS critique** : Vérifier que toutes les requêtes passent par les policies
- **Trigger max 3 réponses** : Double validation (SQL + serveur)
- **Realtime** : Nécessite configuration Supabase (voir Phase 4)
- **SIRET + assurance** : Optionnel MVP, obligatoire V2

---

**Maintenant prêt pour Phase 5 ! 🚀**
