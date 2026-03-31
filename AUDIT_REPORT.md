# Audit complet — ArtisanConnect

**Date** : 31 Mars 2026
**Build** : `next build` passe sans erreur (Turbopack)
**Routes** : 22 pages fonctionnelles + robots.txt + sitemap.xml

---

## Résumé exécutif

L'application est **fonctionnelle pour un MVP**. Le build compile, les routes existent, le flux principal (inscription → onboarding → projet → réponse → chat) est implémenté. Cependant, il y a **des problèmes à corriger avant mise en production**, classés par priorité.

---

## 🔴 CRITIQUES — À corriger avant mise en production

### 1. Validation serveur absente

**Fichiers concernés** : tous les `actions.ts`

Aucune validation côté serveur sur les données de formulaire. Le code fait confiance au client pour envoyer des données valides.

| Fichier | Champs sans validation serveur |
|---|---|
| `(auth)/actions.ts` | email, password, role, prenom, nom |
| `artisan/onboarding/actions.ts` | nom_entreprise, SIRET (14 chiffres), code_postal (5 chiffres), rayon_km (NaN possible) |
| `particulier/nouveau-projet/actions.ts` | titre, description, categorie_id (parseInt peut retourner NaN), code_postal |
| `artisan/repondre/[id]/actions.ts` | message_initial (aucun contrôle de longueur min/max) |
| `artisan/profil/actions.ts` | SIRET, code_postal, rayon_km + slug |
| `particulier/profil/actions.ts` | telephone, code_postal |

**Impact** : un utilisateur malveillant peut envoyer des données vides ou invalides directement via les Server Actions.

**Correction** : ajouter une fonction `validateFormData()` dans chaque action, avec des vérifications de longueur, format regex, et retour d'erreur propre.

---

### 2. Sécurité auth — pas de confirmation email

**Fichier** : `(auth)/actions.ts`

Supabase est configuré avec `signUp()` mais le flux ne vérifie pas si l'email est confirmé. Un utilisateur peut s'inscrire avec un email inexistant et accéder immédiatement à la plateforme.

**Correction** : activer "Confirm email" dans Supabase Dashboard → Authentication → Settings.

---

### 3. Open redirect dans /auth/callback

**Fichier** : `app/auth/callback/route.ts` (ligne 12)

```ts
const redirect = searchParams.get('redirect') || '/'
```

Le paramètre `redirect` vient de l'URL et est utilisé sans validation. Un attaquant peut forger un lien : `/auth/callback?code=xxx&redirect=https://evil.com`

**Correction** : valider que `redirect` commence par `/` et ne contient pas de protocole.

---

### 4. Suppression de compte (RGPD) sans confirmation suffisante

**Fichier** : `app/(auth)/rgpd-actions.ts`

La suppression utilise `SUPABASE_SERVICE_ROLE_KEY` (qui bypass RLS). Le bouton de suppression dans les formulaires de profil n'a qu'un `confirm()` JavaScript — facilement contournable.

**Corrections** :
- Demander le mot de passe de l'utilisateur avant suppression
- Ajouter un délai de grâce (7 jours) avec possibilité d'annuler
- Logger les suppressions

---

### 5. Catégories artisan — pas de transaction

**Fichiers** : `artisan/onboarding/actions.ts` (ligne 38-51), `artisan/profil/actions.ts` (ligne 53+)

La mise à jour des catégories fait DELETE ALL puis INSERT. Si l'INSERT échoue, l'artisan se retrouve sans catégories. Pas de rollback possible.

**Correction** : encapsuler dans une RPC Supabase (fonction SQL) ou vérifier le résultat de chaque opération.

---

## 🟠 IMPORTANTS — À corriger rapidement

### 6. N+1 queries dans les pages de conversations

**Fichiers** : `artisan/conversations/page.tsx`, `particulier/conversations/page.tsx`

Pour chaque conversation, 2 requêtes sont exécutées (dernier message + compteur non-lus). Avec 50 conversations → 100 requêtes par page load.

**Correction** : créer une vue SQL ou une RPC qui retourne conversations + dernier message + unread count en une seule requête.

---

### 7. Chat — pas de pagination des messages

**Fichier** : `components/chat/ChatRoom.tsx`

Tous les messages d'une conversation sont chargés d'un coup. Après 1000 messages, la page sera très lente.

**Correction** : ajouter une pagination inversée (charger les 50 derniers, puis charger les précédents au scroll).

---

### 8. Chat — pas de reconnexion Realtime

**Fichier** : `components/chat/ChatRoom.tsx`

Si la connexion WebSocket tombe (3G, Wi-Fi instable), pas de mécanisme de reconnexion ni de rattrapage des messages manqués.

**Correction** : écouter les événements de reconnexion Supabase Realtime et refetch les messages manqués.

---

### 9. `as any` omniprésent — type safety compromise

**Fichiers concernés** : 15+ fichiers

Au total, **25+ occurrences de `as any`** dans le code. Les types Supabase ne sont pas correctement inférés, forçant des casts.

**Correction** : régénérer les types avec `npx supabase gen types typescript` et typer correctement les requêtes avec `.returns<Type>()`.

---

### 10. Proxy — requêtes multiples par page load

**Fichier** : `proxy.ts`

Le proxy fait jusqu'à **3 requêtes Supabase par requête HTTP** (profil, artisan/particulier, profil à nouveau pour auth pages). Sur un site avec du trafic, ça crée un bottleneck.

**Correction** : mettre le rôle dans le JWT custom claims Supabase pour éviter de requêter la BDD à chaque requête.

---

### 11. Page de connexion — état de chargement bloqué

**Fichier** : `app/(auth)/connexion/page.tsx`

Si `signIn()` réussit, `setLoading(false)` n'est jamais appelé (le code redirect avant). Ce n'est pas un vrai bug (le redirect coupe le composant), mais si le redirect est lent, le bouton reste "Connexion..." indéfiniment.

---

### 12. Double soumission possible partout

Aucun formulaire de l'application ne désactive le bouton submit pendant la soumission ET ne bloque les re-soumissions. Des clics rapides peuvent créer des doublons (sauf si la BDD a des contraintes UNIQUE).

**Correction** : ajouter `disabled={loading}` sur tous les boutons + `useTransition()` pour les Server Actions.

---

## 🟡 AMÉLIORATIONS — Pour la qualité de production

### 13. Pas de rate limiting

Aucune protection contre le brute force sur login, le spam de projets, ou l'envoi massif de messages.

**Correction** : utiliser les Edge Functions Supabase ou un middleware de rate limiting.

---

### 14. Pas de logging/monitoring

Aucun log d'erreur, d'audit trail, ou de monitoring de performance.

**Correction** : intégrer Sentry ou Vercel Analytics.

---

### 15. Variables d'environnement non validées

**Fichiers** : `lib/supabase/*.ts`

Les variables `process.env.NEXT_PUBLIC_SUPABASE_URL!` sont utilisées avec `!` (non-null assertion). Si une variable manque, crash au runtime sans message clair.

**Correction** : valider les env vars au démarrage avec une fonction `validateEnv()`.

---

### 16. Mot de passe — pas d'exigences de sécurité

Le formulaire d'inscription accepte un mot de passe de 6 caractères sans complexité. Supabase ne renforce pas ça par défaut.

**Correction** : ajouter une validation côté client ET serveur (8 chars min, 1 majuscule, 1 chiffre).

---

### 17. Pas de confirmation sur accepter/refuser une réponse

**Fichier** : `components/projects/ReponseActions.tsx`

Accepter ou refuser une réponse est irréversible (le trigger SQL crée la conversation). Aucune modale de confirmation.

**Correction** : ajouter un dialog de confirmation avant l'action.

---

### 18. Landing page — prix hardcodés

**Fichier** : `app/page.tsx`

Les prix (50€/mois, 40€/mois, 25€/mois) sont écrits en dur dans le JSX.

**Correction** : déplacer les prix dans un fichier de config ou en base de données.

---

### 19. Sitemap — pas de pagination

**Fichier** : `app/sitemap.ts`

Si 10 000 artisans s'inscrivent, le sitemap sera un seul fichier massif. Google recommande max 50 000 URLs par sitemap.

**Correction** : implémenter un sitemap index avec des sous-sitemaps.

---

### 20. Feed artisan — logique `respondedProjectIds` inefficace

**Fichier** : `app/artisan/feed/page.tsx`

L'algorithme pour déterminer si l'artisan a déjà répondu est O(n²) : boucle imbriquée avec `.flatMap()`, `.filter()`, `.find()`.

**Correction** : faire la vérification côté SQL (LEFT JOIN sur reponses WHERE artisan_id = X) plutôt que côté JS.

---

## ✅ Ce qui fonctionne bien

| Feature | Statut | Notes |
|---|---|---|
| Inscription / Connexion | ✅ | Flux complet, choix de rôle |
| Onboarding artisan | ✅ | SIRET, métiers, zone |
| Onboarding particulier | ✅ | Adresse, CP, ville |
| Dépôt de projet | ✅ | Formulaire complet |
| Feed artisan | ✅ | Filtré par zone + catégories (RLS) |
| Réponse artisan | ✅ | Max 3/projet (trigger + serveur) |
| Accepter/refuser réponse | ✅ | Trigger crée conversation |
| Chat temps réel | ✅ | Supabase Realtime, envoi optimiste |
| Liste conversations | ✅ | Badge non-lus, tri par date |
| Profil artisan public | ✅ | SSR, SEO metadata |
| Landing page | ✅ | Hero, pricing, métiers |
| Sitemap + robots.txt | ✅ | Dynamique |
| Mot de passe oublié | ✅ | Reset via Supabase |
| Gestion de profil | ✅ | Artisan + Particulier |
| Suppression RGPD | ✅ | Via Service Role Key |
| Mes devis (artisan) | ✅ | Liste avec statuts |
| Barre de navigation | ✅ | Artisan + Particulier |
| Build Next.js | ✅ | 0 erreur |

---

## Plan d'action recommandé

### Sprint 1 — Sécurité (avant mise en prod)
1. ⬜ Validation serveur sur TOUS les `actions.ts`
2. ⬜ Activer confirmation email dans Supabase
3. ⬜ Corriger open redirect dans `/auth/callback`
4. ⬜ Améliorer la suppression RGPD (mot de passe requis)
5. ⬜ Transaction pour les catégories artisan

### Sprint 2 — Performance
6. ⬜ Résoudre le N+1 dans les conversations (vue SQL)
7. ⬜ Paginer les messages du chat
8. ⬜ Reconnexion Realtime
9. ⬜ Optimiser le proxy (JWT custom claims)
10. ⬜ Corriger le feed artisan (requête SQL au lieu de O(n²) JS)

### Sprint 3 — Qualité
11. ⬜ Supprimer tous les `as any` (régénérer les types)
12. ⬜ Rate limiting sur auth + actions
13. ⬜ Validation des env vars au démarrage
14. ⬜ Modale de confirmation sur accepter/refuser
15. ⬜ Désactiver les boutons pendant la soumission

### Sprint 4 — Production readiness
16. ⬜ Monitoring (Sentry / Vercel Analytics)
17. ⬜ Logging des erreurs côté serveur
18. ⬜ Externaliser les prix dans une config
19. ⬜ Pagination du sitemap
20. ⬜ Tests (au moins les Server Actions critiques)

---

**Verdict** : L'application est un MVP fonctionnel. Les 5 points critiques (validation, email, redirect, RGPD, transactions) doivent être corrigés AVANT mise en production. Le reste peut être fait progressivement.
