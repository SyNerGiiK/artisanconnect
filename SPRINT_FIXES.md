# Sprint Corrections — Plan d'exécution

**Contexte** : Un audit de vérification a identifié des items marqués comme terminés mais non implémentés, plus quelques bugs mineurs. Ce fichier est ton plan d'exécution précis.

**Branche** : `fix/sprint-corrections`
**Base** : créer depuis `main` (après avoir pull)

---

## Règles de travail

- Lis `CLAUDE_CODE_PROMPT.md` pour les conventions (code en anglais, UI en français)
- Lis `VERIFICATION_REPORT.md` pour comprendre ce qui a été vérifié et ce qui manque
- Ne modifie PAS les fichiers de migration SQL existants — crée de nouveaux fichiers si besoin
- Committe après chaque correction (pas un seul gros commit)
- Mets à jour `AUDIT_REPORT.md` une fois terminé

---

## Correction 1 — Pagination des messages du chat (PRIORITÉ HAUTE)

### Problème
`components/chat/ChatRoom.tsx` charge TOUS les messages d'une conversation d'un coup. Avec 1000+ messages, la page sera inutilisable. L'item était marqué comme fait dans AUDIT_REPORT.md mais n'a jamais été implémenté.

### Ce qu'il faut faire

**Fichier à modifier** : `components/chat/ChatRoom.tsx`

1. **Charger les 50 derniers messages au lieu de tout** :

```typescript
const PAGE_SIZE = 50

// Initial fetch: les 50 derniers
const { data, count } = await supabase
  .from('messages')
  .select('*', { count: 'exact' })
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: false })
  .range(0, PAGE_SIZE - 1)

// Inverser pour afficher du plus ancien au plus récent
if (data) setMessages(data.reverse())
```

2. **Ajouter un état pour la pagination** :

```typescript
const [hasMore, setHasMore] = useState(true)
const [loadingMore, setLoadingMore] = useState(false)
const [totalCount, setTotalCount] = useState(0)
```

3. **Fonction "Charger les messages précédents"** :

```typescript
async function loadOlderMessages() {
  if (loadingMore || !hasMore) return
  setLoadingMore(true)

  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(messages.length, messages.length + PAGE_SIZE - 1)

  if (data && data.length > 0) {
    setMessages((prev) => [...data.reverse(), ...prev])
    if (data.length < PAGE_SIZE) setHasMore(false)
  } else {
    setHasMore(false)
  }
  setLoadingMore(false)
}
```

4. **Bouton en haut de la zone de messages** :

```tsx
{hasMore && (
  <button
    onClick={loadOlderMessages}
    disabled={loadingMore}
    className="mx-auto block text-sm text-blue-600 hover:text-blue-800 py-2"
  >
    {loadingMore ? 'Chargement...' : 'Charger les messages précédents'}
  </button>
)}
```

5. **Conserver la position de scroll** lors du chargement des anciens messages (le scroll ne doit pas sauter en haut) :

```typescript
const scrollContainerRef = useRef<HTMLDivElement>(null)

// Avant de prepend les vieux messages, sauvegarder scrollHeight
const prevScrollHeight = scrollContainerRef.current?.scrollHeight || 0

// Après le setState, restaurer la position
requestAnimationFrame(() => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop =
      scrollContainerRef.current.scrollHeight - prevScrollHeight
  }
})
```

### Comportement attendu
- Au chargement : seuls les 50 derniers messages apparaissent
- Un bouton "Charger les messages précédents" apparaît en haut s'il y a plus de 50 messages
- Le scroll reste stable quand on charge les anciens messages
- Les nouveaux messages (Realtime) continuent à apparaître en bas

---

## Correction 2 — Reconnexion Realtime avec rattrapage (PRIORITÉ HAUTE)

### Problème
`components/chat/ChatRoom.tsx` n'a aucun mécanisme de reconnexion si le WebSocket tombe. Sur mobile (3G/Wi-Fi instable), les messages sont perdus silencieusement. L'item était marqué comme fait dans AUDIT_REPORT.md mais n'a jamais été implémenté.

### Ce qu'il faut faire

**Fichier à modifier** : `components/chat/ChatRoom.tsx`

Dans le `useEffect` qui gère le Realtime, ajouter un listener sur le statut du channel :

```typescript
useEffect(() => {
  let lastSeenAt = new Date().toISOString()

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const newMessage = payload.new as MessageRow
        lastSeenAt = newMessage.created_at
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })
      }
    )
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Reconnexion: rattraper les messages manqués
        const { data: missedMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .gt('created_at', lastSeenAt)
          .order('created_at', { ascending: true })

        if (missedMessages && missedMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            const newOnes = missedMessages.filter((m) => !existingIds.has(m.id))
            return [...prev, ...newOnes]
          })
          lastSeenAt = missedMessages[missedMessages.length - 1].created_at
        }
      }
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [conversationId, supabase])
```

### Comportement attendu
- Si le WebSocket se déconnecte et se reconnecte, les messages manqués sont récupérés automatiquement
- Pas de doublons grâce au check `existingIds`
- Le `lastSeenAt` avance à chaque message reçu

---

## Correction 3 — Bug `Number() ?? 0` (PRIORITÉ BASSE)

### Problème
Dans `app/artisan/conversations/page.tsx` et `app/particulier/conversations/page.tsx` :

```typescript
unreadCount: Number(row.unread_artisan_count) ?? 0
```

L'opérateur `??` ne catch pas `NaN`. Si `row.unread_artisan_count` est `undefined`, `Number(undefined)` retourne `NaN`, et `NaN ?? 0` retourne `NaN` (car `NaN` n'est ni `null` ni `undefined`).

### Correction

**Fichier 1** : `app/artisan/conversations/page.tsx`
**Fichier 2** : `app/particulier/conversations/page.tsx`

Remplacer `??` par `||` :

```typescript
// AVANT
unreadCount: Number(row.unread_artisan_count) ?? 0

// APRÈS
unreadCount: Number(row.unread_artisan_count) || 0
```

Faire ce remplacement dans les deux fichiers (artisan utilise `unread_artisan_count`, particulier utilise `unread_particulier_count`).

---

## Checklist finale

Après toutes les corrections, vérifier :

- [ ] `npm run build` passe sans erreur
- [ ] Le chat charge 50 messages max au départ
- [ ] Le bouton "Charger les messages précédents" fonctionne
- [ ] Le scroll reste stable au chargement des anciens messages
- [ ] Le Realtime se reconnecte et rattrape les messages manqués
- [ ] `Number() || 0` utilisé partout au lieu de `Number() ?? 0`
- [ ] `AUDIT_REPORT.md` mis à jour (items 7 et 8 réellement cochés)

## Commits à faire (dans cet ordre)

```
1. feat: add chat message pagination (load 50 latest + infinite scroll)
2. feat: add Realtime reconnection with missed message recovery
3. fix: replace Number() ?? 0 with Number() || 0 in conversation pages
```

Chaque commit doit être propre et autonome. À la fin, push la branche et crée une PR vers `main`.
