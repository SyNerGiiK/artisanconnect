# Messagerie temps réel — ArtisanConnect

## Déclenchement

La conversation est créée automatiquement par le trigger SQL `on_reponse_accepted` quand un particulier accepte une réponse. Il n'y a pas de bouton "créer une conversation" — c'est une conséquence de l'acceptation.

## Architecture

```
Particulier accepte une réponse
    │
    └── UPDATE reponses SET statut = 'acceptee'
        │
        └── Trigger SQL : INSERT INTO conversations (projet_id, artisan_id, particulier_id)
            │
            └── La conversation apparaît dans :
                ├── /particulier/conversations
                └── /artisan/conversations
```

## Composants

### ChatRoom (components/chat/ChatRoom.tsx)

Composant client principal. Responsable de :

1. **Chargement initial** : fetch tous les messages de la conversation
2. **Temps réel** : s'abonne au channel Supabase Realtime (`postgres_changes` INSERT sur `messages`)
3. **Envoi optimiste** : le message apparaît immédiatement côté expéditeur (UUID local), puis est remplacé par la version serveur via Realtime
4. **Lecture auto** : les messages non lus de l'interlocuteur sont marqués `lu = true` à l'affichage
5. **Auto-scroll** : défilement automatique vers le bas à chaque nouveau message

### MessageBubble (components/chat/MessageBubble.tsx)

Bulle de message stylée différemment selon l'expéditeur :
- **Message envoyé** : bleu, aligné à droite, sans nom d'auteur
- **Message reçu** : gris, aligné à gauche, avec nom d'auteur

### ChatInput (components/chat/ChatInput.tsx)

Zone de saisie avec :
- **Enter** pour envoyer (Shift+Enter pour un saut de ligne)
- Bouton "Envoyer" désactivé si le message est vide

### ConversationCard (components/chat/ConversationCard.tsx)

Carte cliquable dans la liste des conversations affichant :
- Avatar (initiale du nom)
- Nom de l'interlocuteur (ou nom d'entreprise pour les artisans)
- Titre du projet
- Dernier message (tronqué)
- Date du dernier message
- Badge de messages non lus

## Pages

### Liste des conversations

| Route | Rôle | Interlocuteur affiché |
|---|---|---|
| `/artisan/conversations` | Artisan | Prénom Nom du particulier |
| `/particulier/conversations` | Particulier | Nom d'entreprise de l'artisan |

Chaque page :
- Fetch les conversations via RLS (seuls les participants voient les leurs)
- Pour chaque conversation : récupère le dernier message + compteur de non-lus
- Trie par date du dernier message (plus récent en premier)

### Chat

| Route | Rôle |
|---|---|
| `/artisan/conversations/[id]` | Artisan |
| `/particulier/conversations/[id]` | Particulier |

Chaque page :
- Vérifie que l'utilisateur est bien participant de la conversation
- Construit un `participants` map (id → prenom/nom) pour l'affichage
- Rend le composant `ChatRoom`

## Supabase Realtime — Configuration requise

Pour que le temps réel fonctionne, **Realtime doit être activé** sur la table `messages` dans le dashboard Supabase :

1. Aller dans **Database → Tables → messages**
2. Cliquer sur **Enable Realtime**

Ou via SQL :

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## Sécurité

- **RLS** sur `conversations` : seuls les 2 participants peuvent SELECT
- **RLS** sur `messages` : seuls les participants de la conversation associée peuvent INSERT/SELECT
- Le chat ne s'ouvre qu'après acceptation d'une réponse (pas d'accès direct)
- Les messages non lus sont marqués lus uniquement par le destinataire (pas par l'expéditeur)
