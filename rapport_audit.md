# Audit Technique Critique - ArtisanConnect

**Date :** 21 Avril 2026  
**Statut :** Exhaustif  
**Sévérité globale :** 🟠 Modérée (Fondations solides, mais optimisations critiques requises avant passage à l'échelle)

---

## 1. Sécurité & Authentification 🔐

### Points Forts
*   **Supabase RLS :** Activé sur toutes les tables métier. Les politiques sont bien segmentées par rôle (Artisan vs Particulier).
*   **Protection des Routes :** Centralisée dans `proxy.ts`, garantissant qu'un utilisateur non authentifié ne peut accéder aux espaces privés.
*   **RGPD :** Suppression de compte implémentée avec vérification du mot de passe et `ON DELETE CASCADE`.

### Failles & Risques Identifiés
*   **Validation des Entrées :** Les Server Actions (ex: `signUp`, `completeArtisanOnboarding`) manquent de validation de schéma robuste (Zod). Risque d'injection de données malformées ou trop volumineuses.
*   **Open Redirect :** Dans `/auth/callback`, le paramètre `next` n'est pas validé. Un attaquant pourrait rediriger un utilisateur vers un site malveillant après connexion.
*   **Gestion du Service Role :** Utilisé dans `rgpd-actions.ts`. Bien que nécessaire, l'instanciation du client admin à chaque appel est coûteuse et doit rester strictement limitée aux actions "Admin Only".
*   **Email Confirmation :** Si non forcé dans Supabase, n'importe qui peut s'inscrire avec un email bidon pour polluer la base d'artisans/particuliers.

---

## 2. Architecture & Performance 🚀

### Points Critiques
*   **`proxy.ts` (Next.js 16) :** 
    *   **Problème :** Effectue des requêtes en base de données (`select('id').single()`) à **chaque changement de page** pour vérifier le statut d'onboarding.
    *   **Impact :** Latence inutile sur chaque navigation.
    *   **Solution :** Stocker le flag `onboarding_completed` dans les `user_metadata` du JWT lors de la complétion du profil.
*   **Requêtes N+1 & Feed Artisan :**
    *   Dans `app/artisan/feed/page.tsx`, la récupération des projets et des réponses se fait en parallèle, mais le filtrage des projets déjà répondus se fait en mémoire (JS) sur le client.
    *   **Risque :** Si le feed contient des milliers de projets, la performance chutera.
*   **Realtime & Chat :**
    *   `ChatRoom.tsx` utilise une stratégie de reconnexion manuelle (`lastSeenAt`). C'est robuste, mais le `useEffect` pour marquer comme "lu" déclenche un update pour *chaque* message non lu individuellement ou via un `in [ids]`. Attention à la fréquence des updates lors de la réception de rafales de messages.

### Structure du Code
*   **Modularité :** Excellente séparation via le App Router. L'usage de `lib/supabase/` pour les différents contextes (client, server, middleware) est conforme aux meilleures pratiques.
*   **Type Safety :** Usage excessif de `as any` dans les composants serveurs (ex: `ArtisanFeedPage`). Cela annule les bénéfices de TypeScript et cache des bugs potentiels de structure de données.

---

## 3. Bugs & Failles Logiques 🐛

*   **Race Condition (Limite de 3 réponses) :** 
    *   Un trigger SQL existe, mais si deux artisans cliquent simultanément alors qu'il reste 1 place, les deux pourraient passer si la vérification se fait avant l'insert.
    *   *Note :* La migration `014_fix_check_max_reponses_race.sql` semble traiter cela, mais une validation transactionnelle forte est requise.
*   **Gestion des Erreurs :** 
    *   Beaucoup de Server Actions renvoient `{ error: string }` sans logger l'erreur réelle côté serveur de manière structurée, rendant le debugging en production difficile.

---

## 4. Recommandations Prioritaires (Action Plan) 🛠️

### P0 - Critique (Sécurité & Stabilité)
1.  **Validation Zod :** Ajouter des schémas Zod à toutes les Server Actions pour valider les payloads.
2.  **Sécuriser Redirect :** Valider que le paramètre `next` dans `/auth/callback` commence par `/` et ne contient pas de domaine externe.
3.  **Type Safety :** Régénérer les types Supabase (`npx supabase gen types typescript --project-id ...`) et supprimer les `as any`.

### P1 - Performance (Expérience Utilisateur)
1.  **JWT Metadata :** Migrer le flag d'onboarding dans les métadonnées utilisateur pour supprimer les DB hits dans `proxy.ts`.
2.  **Pagination Feed :** Implémenter une pagination réelle (Infinite Scroll) sur le feed artisan pour éviter de charger trop de projets d'un coup.
3.  **Optimisation Images :** Vérifier que tous les uploads (photos de projets) passent par un redimensionnement côté client ou via un worker pour éviter de stocker des fichiers de 10Mo.

### P2 - Maintenance
1.  **Logs :** Mettre en place un système de logging (ex: Axiom ou Sentry) pour capturer les erreurs des Server Actions.
2.  **Tests :** Ajouter des tests d'intégration sur le flux critique (Inscription -> Dépôt Projet -> Réponse -> Chat).

---

**Conclusion :** Le projet est sain et bien structuré. L'effort principal doit maintenant porter sur la **sécurisation des entrées** et l'**optimisation de la couche middleware/proxy** pour garantir une fluidité parfaite lors de la montée en charge.
