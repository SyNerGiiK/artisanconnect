# Sprint Sécurité — Plan d'action pour IA

**Contexte** : Ce fichier est un plan d'exécution précis. Tu dois corriger les 5 failles critiques identifiées dans `AUDIT_REPORT.md`. Lis ce fichier en entier avant de coder.

**Branche** : `fix/sprint-security`
**Base** : créer depuis `main` (après avoir pull)

---

## Règles de travail

- Lis `CLAUDE_CODE_PROMPT.md` pour les conventions (code en anglais, UI en français)
- Lis `PROJECT_STATUS.md` pour l'état exact du projet
- Ne modifie PAS les fichiers de migration SQL existants — crée de nouveaux fichiers si besoin
- Chaque correction doit être testable indépendamment
- Committe après chaque correction (pas un seul gros commit)
- Mets à jour `AUDIT_REPORT.md` en cochant les items terminés (⬜ → ✅)

---

## Correction 1 — Validation serveur sur tous les `actions.ts`

### Ce qui manque
Aucun `actions.ts` ne valide les données côté serveur. Le client peut envoyer n'importe quoi.

### Fichier à créer

**`lib/utils/validation.ts`** — fonctions de validation réutilisables :

```typescript
// Fonctions à implémenter :

// Valide un string non vide après trim, avec longueur min/max
export function validateString(value: unknown, fieldName: string, min?: number, max?: number): string

// Valide un email (regex basique)
export function validateEmail(value: unknown): string

// Valide un mot de passe (min 8 chars, 1 majuscule, 1 chiffre)
export function validatePassword(value: unknown): string

// Valide un code postal français (5 chiffres)
export function validateCodePostal(value: unknown): string

// Valide un SIRET (14 chiffres, optionnel)
export function validateSiret(value: unknown): string | null

// Valide un entier dans une plage
export function validateInt(value: unknown, fieldName: string, min?: number, max?: number): number

// Valide que la valeur est dans une liste autorisée
export function validateEnum<T extends string>(value: unknown, allowed: T[], fieldName: string): T

// Chaque fonction doit throw une Error avec un message en français si invalide
```

### Fichiers `actions.ts` à modifier (7 fichiers)

**1. `app/(auth)/actions.ts` — signUp()**
- Valider : email (format), password (8 chars, 1 maj, 1 chiffre), role (enum: 'particulier' | 'artisan'), prenom (2-50 chars), nom (2-50 chars)
- Retourner `{ error: "..." }` si invalide (pas de throw, car Server Action)

**2. `app/(auth)/actions.ts` — signIn()**
- Valider : email (format), password (non vide)

**3. `app/artisan/onboarding/actions.ts` — completeArtisanOnboarding()**
- Valider : nom_entreprise (2-100 chars), siret (14 chiffres ou vide), code_postal_base (5 chiffres), rayon_km (1-200), categorie_ids (au moins 1, tous des entiers valides)

**4. `app/artisan/profil/actions.ts` — updateArtisanProfile()**
- Même validations que onboarding + prenom (2-50), nom (2-50), telephone (optionnel, 10 chiffres si présent)

**5. `app/particulier/onboarding/actions.ts` — completeParticulierOnboarding()**
- Valider : code_postal (5 chiffres si rempli), ville (2-100 chars si rempli)

**6. `app/particulier/nouveau-projet/actions.ts` — createProject()**
- Valider : titre (5-150 chars), description (20-2000 chars), categorie_id (entier > 0), adresse (5-200 chars), code_postal (5 chiffres), ville (2-100 chars)

**7. `app/artisan/repondre/[id]/actions.ts` — submitReponse()**
- Valider : message_initial (20-2000 chars), projetId (UUID format)

### Pattern à suivre dans chaque action

```typescript
export async function monAction(formData: FormData) {
  // 1. Extraction
  const rawTitre = formData.get('titre')

  // 2. Validation (try/catch pour les throw de validation.ts)
  try {
    const titre = validateString(rawTitre, 'Titre', 5, 150)
    // ...autres validations
  } catch (e) {
    return { error: (e as Error).message }
  }

  // 3. Logique métier (inchangée)
}
```

---

## Correction 2 — Open redirect dans /auth/callback

### Fichier à modifier

**`app/auth/callback/route.ts`**

### Ce qu'il faut changer

Ligne 12 actuellement :
```typescript
const redirect = searchParams.get('redirect') || '/'
```

Remplacer par :
```typescript
const redirectParam = searchParams.get('redirect') || '/'
// Prevent open redirect: only allow relative paths starting with /
const redirect = redirectParam.startsWith('/') && !redirectParam.startsWith('//')
  ? redirectParam
  : '/'
```

C'est une correction de 3 lignes. Ne pas over-engineerer.

---

## Correction 3 — Suppression RGPD améliorée

### Fichier à modifier

**`app/(auth)/rgpd-actions.ts`**

### Ce qu'il faut changer

Ajouter une vérification du mot de passe AVANT la suppression :

```typescript
export async function deleteUserAccount(password: string) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  // Vérifier le mot de passe avant suppression
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  })
  if (authError) return { error: 'Mot de passe incorrect' }

  // Suppression via admin (le reste est inchangé)
  // ...
}
```

### Fichiers de formulaire à modifier

**`app/artisan/profil/ArtisanProfileForm.tsx`** et **`app/particulier/profil/ParticulierProfileForm.tsx`**

Ajouter un champ mot de passe dans la section de suppression :
- Input `type="password"` avec label "Confirmez votre mot de passe pour supprimer votre compte"
- Passer le mot de passe à `deleteUserAccount(password)`
- Afficher l'erreur si mot de passe incorrect
- Le bouton ne doit être actif que si le mot de passe est rempli

---

## Correction 4 — Transaction pour les catégories artisan

### Fichier à créer

**`supabase/migrations/004_update_artisan_categories_rpc.sql`**

Créer une RPC Supabase qui fait DELETE + INSERT dans une transaction :

```sql
CREATE OR REPLACE FUNCTION update_artisan_categories(
  p_artisan_id uuid,
  p_categorie_ids int[]
)
RETURNS void AS $$
BEGIN
  -- Delete existing categories
  DELETE FROM artisan_categories WHERE artisan_id = p_artisan_id;

  -- Insert new categories
  INSERT INTO artisan_categories (artisan_id, categorie_id)
  SELECT p_artisan_id, unnest(p_categorie_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Fichiers à modifier

**`app/artisan/onboarding/actions.ts`** et **`app/artisan/profil/actions.ts`**

Remplacer le pattern DELETE + INSERT par :

```typescript
const { error: catError } = await supabase.rpc('update_artisan_categories', {
  p_artisan_id: artisan.id,
  p_categorie_ids: categorieIds,
})
```

### Fichier types à modifier

**`lib/types/database.types.ts`** — Ajouter la RPC dans la section Functions :

```typescript
Functions: {
  update_artisan_categories: {
    Args: { p_artisan_id: string; p_categorie_ids: number[] }
    Returns: void
  }
}
```

---

## Correction 5 — Confirmation email

### Pas de code à écrire

Aller dans le dashboard Supabase :
1. **Authentication → Settings → Email Auth**
2. Activer "Confirm email"
3. Personnaliser le template d'email en français

### Fichier à modifier (UX)

**`app/(auth)/actions.ts` — signUp()**

Après le `signUp()` réussi, au lieu de redirect immédiat, retourner un message de succès :

```typescript
if (!error) {
  return { success: 'Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail.' }
}
```

**`app/(auth)/inscription/page.tsx`**

Afficher le message de succès au lieu de redirect :

```tsx
const [success, setSuccess] = useState<string | null>(null)

// Dans handleSubmit :
if (result?.success) {
  setSuccess(result.success)
  setLoading(false)
  return
}

// Dans le JSX, si success est non-null :
// Afficher un message vert "Email envoyé, vérifiez votre boîte mail"
// Cacher le formulaire
```

---

## Checklist finale

Après toutes les corrections, vérifier :

- [ ] `npm run build` passe sans erreur
- [ ] `lib/utils/validation.ts` existe et exporte toutes les fonctions
- [ ] Chaque `actions.ts` utilise les validations
- [ ] `/auth/callback` ne permet plus de redirect externe
- [ ] Suppression RGPD demande le mot de passe
- [ ] La RPC `update_artisan_categories` est dans une migration SQL
- [ ] L'inscription affiche "email de confirmation envoyé" au lieu de redirect
- [ ] `AUDIT_REPORT.md` est mis à jour (Sprint 1 coché)

## Commits à faire (dans cet ordre)

```
1. feat: add server-side validation utility + validate all actions
2. fix: prevent open redirect in auth callback
3. fix: require password confirmation for RGPD account deletion
4. feat: add SQL RPC for atomic artisan categories update
5. feat: require email confirmation on signup
```

Chaque commit doit être propre et autonome. À la fin, push la branche et crée une PR vers `main`.
