# Prompts v0.dev — ArtisanConnect

Copier-coller chaque prompt dans v0.dev (https://v0.dev).
Récupérer le code généré et l'adapter au projet.

**Contraintes globales à ajouter dans chaque prompt** :
- React + Tailwind CSS v4 (utility classes)
- Pas de librairies UI externes (pas de shadcn, radix, etc.)
- Couleurs : bleu principal (#2563EB / blue-600), gris fond (#F9FAFB / gray-50)
- Police : Geist Sans
- Mobile-first, responsive
- Textes en français

---

## 1. Landing Page

```
Crée une landing page moderne pour "ArtisanConnect", une plateforme française de mise en relation entre particuliers et artisans du bâtiment.

Contraintes : React + Tailwind CSS, pas de librairies UI, mobile-first, tous les textes en français. Couleur principale : blue-600 (#2563EB), fond : gray-50.

Sections dans l'ordre :

1. HEADER / NAV
- Logo "ArtisanConnect" à gauche (texte bold, pas d'image)
- Liens : "Comment ça marche", "Tarifs", "Nos métiers"
- Boutons à droite : "Se connecter" (outline) et "S'inscrire" (blue-600 plein)
- Sticky en haut, fond blanc avec border-bottom subtle

2. HERO
- Titre : "Trouvez le bon artisan près de chez vous"
- Sous-titre : "Décrivez votre projet, recevez jusqu'à 3 devis d'artisans vérifiés. Gratuit pour les particuliers, sans commission."
- 2 boutons CTA : "Je cherche un artisan" (blue-600 gros) et "Je suis artisan" (outline gros)
- Background : dégradé subtil bleu-blanc ou illustration abstraite
- Grande section, impact visuel fort

3. COMMENT ÇA MARCHE — 3 étapes en cards horizontales (empilées sur mobile)
- Étape 1 : icône 📝 — "Décrivez votre projet" — "Remplissez un formulaire simple avec les détails de vos travaux"
- Étape 2 : icône 🔧 — "Recevez 3 devis" — "Jusqu'à 3 artisans vérifiés de votre zone vous répondent"
- Étape 3 : icône 💬 — "Échangez et choisissez" — "Discutez via le chat sécurisé et choisissez votre artisan"
- Design : numéros ronds (1, 2, 3) avec ligne connectrice entre eux

4. POUR LES PARTICULIERS — section fond blanc
- Titre : "Gratuit pour les particuliers"
- 4 avantages en grille 2x2 :
  - "Devis gratuits et sans engagement"
  - "Artisans vérifiés (SIRET + assurance)"
  - "Maximum 3 artisans par projet — pas de harcèlement"
  - "Chat sécurisé — vos coordonnées restent privées"
- CTA : "Déposer un projet gratuitement"

5. POUR LES ARTISANS — section fond bleu très léger (blue-50)
- Titre : "Un abonnement fixe, zéro commission"
- 4 avantages en grille 2x2 :
  - "Répondez à autant de chantiers que vous voulez"
  - "Pas de commission sur vos devis"
  - "Clients qualifiés dans votre zone"
  - "Page profil publique pour votre référencement"
- CTA : "Rejoindre en tant qu'artisan"

6. NOS MÉTIERS — 3 cartes avec icônes
- "Peinture intérieure / extérieure" 🎨
- "Revêtement sols et murs" 🏗️
- "Espaces verts et jardinage" 🌿
- Note sous les cartes : "D'autres métiers arrivent bientôt"

7. TARIFS ARTISANS — 3 colonnes pricing
- Mensuel : 50€/mois — "Sans engagement"
- Annuel : 40€/mois (480€/an) — "Économisez 20%" — badge "Populaire"
- Fondateurs : 25€/mois (300€/an à vie) — "50 premières places" — badge "Limité"
- Features communes : "Réponses illimitées", "Chat sécurisé", "Page profil SEO", "Support prioritaire"
- CTA sous chaque colonne : "Commencer"

8. FOOTER
- Logo ArtisanConnect
- Colonnes : "Produit" (Comment ça marche, Tarifs), "Légal" (CGU, CGV, Mentions légales, Politique de confidentialité), "Contact" (email, Vendée 85)
- Copyright 2026

Design global : professionnel, rassurant, français. Pas de design "startup tech". Penser artisan du bâtiment et propriétaire de maison. Beaucoup d'espace blanc, typographie claire, CTA bien visibles.
```

---

## 2. Page Inscription

```
Crée une page d'inscription pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, couleur principale blue-600.

Layout : centré verticalement et horizontalement, fond gray-50, card blanche max-w-md avec shadow-sm.

En haut : logo "ArtisanConnect" (texte bold 2xl).

Contenu de la card :

1. Titre : "Créer un compte"

2. CHOIX DU RÔLE — 2 boutons radio visuels côte à côte (grid 2 cols) :
   - "Particulier" avec icône maison 🏠 et sous-texte "Je cherche un artisan"
   - "Artisan" avec icône clé 🔧 et sous-texte "Je propose mes services"
   - Le sélectionné a un border blue-600 + fond blue-50
   - Le non-sélectionné a un border gray-200

3. FORMULAIRE (apparaît après choix du rôle, avec animation fade-in) :
   - Prénom + Nom (2 inputs sur une ligne)
   - Email
   - Mot de passe (avec indication "8 caractères minimum, 1 majuscule, 1 chiffre")
   - Bouton "S'inscrire" (blue-600, full width)
   - Tous les inputs : rounded-lg, border gray-300, focus blue-500

4. Zone d'erreur : rectangle rouge-50 avec texte red-600, rounded-lg, apparaît si erreur

5. En bas : "Déjà un compte ? Se connecter" (lien blue-600)

Design : épuré, formulaire clair, pas surchargé. La sélection du rôle doit être le premier élément visuel fort.
```

---

## 3. Page Connexion

```
Crée une page de connexion pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, couleur principale blue-600.

Layout identique à l'inscription : centré, fond gray-50, card blanche max-w-md, shadow-sm.

Logo "ArtisanConnect" au-dessus.

Contenu :
1. Titre : "Se connecter"
2. Input Email
3. Input Mot de passe
4. Lien "Mot de passe oublié ?" (aligné à droite, text-sm, blue-600)
5. Bouton "Se connecter" (blue-600, full width)
6. Zone d'erreur (même style que inscription)
7. "Pas encore de compte ? Créer un compte" (lien blue-600)

Design : même style que la page inscription, cohérent, minimaliste.
```

---

## 4. Dashboard Particulier

```
Crée un dashboard pour un particulier sur "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

La navbar est déjà gérée ailleurs — ne PAS l'inclure.

Section header :
- Titre "Mes projets"
- Sous-titre "Bonjour {prénom} — gérez vos projets de travaux ici."
- Bouton "Nouveau projet" à droite (blue-600 + icône +)

Liste de projets (cards empilées) — chaque card contient :
- Ligne 1 : Titre du projet (bold) + badge de statut à droite
  - Statuts possibles avec couleurs : "Ouvert" (vert), "En cours" (bleu), "Terminé" (gris), "Annulé" (rouge)
- Ligne 2 : Description tronquée (2 lignes max, text-gray-600)
- Ligne 3 : Catégorie + Ville (code postal) + Date de création (text-xs gray-500)
- Ligne 4 : "2/3 réponses" + "1 en attente" (jaune) + "1 acceptée" (vert)
- Card entière cliquable (hover: border-blue-300, shadow-sm)

État vide (si aucun projet) :
- Icône centrée (document avec +)
- "Vous n'avez pas encore de projet"
- Bouton "Déposer votre premier projet" (blue-600)
- Background : border-dashed gray-300

Montre 3-4 projets de démo avec différents statuts pour que je voie le rendu.
```

---

## 5. Formulaire Nouveau Projet

```
Crée un formulaire de dépôt de projet pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar — juste le contenu.

En haut : lien retour "← Retour au tableau de bord" (text-sm blue-600).

Titre : "Déposer un projet"
Sous-titre : "Décrivez votre projet de travaux. Jusqu'à 3 artisans pourront vous répondre."

Formulaire (max-w-lg, centré) :
1. Titre du projet * — input text, placeholder "Ex : Peinture salon + couloir"
2. Type de travaux * — select dropdown avec options :
   - "Peinture intérieure / extérieure"
   - "Revêtement sols et murs"
   - "Espaces verts et jardinage"
3. Description * — textarea (4 lignes), placeholder "Décrivez les travaux souhaités, la surface, vos contraintes..."
4. Adresse du chantier * — input text
5. Code postal * + Ville * (2 inputs sur une ligne, grid 2 cols)
6. Bouton "Publier mon projet" (blue-600, full width)

Zone d'erreur rouge si besoin.

Design : formulaire clair, champs bien espacés, labels au-dessus des inputs, astérisques rouges sur les champs requis.
```

---

## 6. Feed Artisan (Chantiers disponibles)

```
Crée une page de feed pour un artisan sur "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Header :
- Titre "Chantiers disponibles"
- Sous-titre "Bonjour {prénom} — retrouvez ici les chantiers dans votre zone."

Bannière d'avertissement (si abonnement inactif) :
- Fond yellow-50, border yellow-200
- "Votre abonnement n'est pas actif. Contactez-nous pour activer votre compte."

Liste de chantiers (cards empilées) — chaque card :
- Ligne 1 : Titre (bold lg) + à droite : "1/3 réponses" + badge "Ouvert" (vert)
- Ligne 2 : Description (3 lignes max, gray-600)
- Ligne 3 : Catégorie + Ville (CP) + Date (text-xs gray-500)
- Ligne 4 : Bouton "Répondre à ce chantier" (blue-600)
  OU texte gris italic "Vous avez déjà répondu à ce chantier"
  OU texte gris italic "3 artisans ont déjà répondu"

Montre 4 chantiers de démo : un disponible, un déjà répondu, un complet (3/3), un avec 2/3.

État vide :
- Icône search
- "Aucun chantier disponible dans votre zone pour le moment."

Design : cartes bien aérées, le bouton "Répondre" doit être l'élément le plus visible sur chaque carte.
```

---

## 7. Page Répondre à un Chantier

```
Crée une page de réponse à un chantier pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Lien retour : "← Retour aux chantiers"

Section résumé du projet (card avec border gray-200) :
- Titre du projet (bold) + badge "Ouvert"
- Description complète (gray-600)
- Catégorie + Ville (CP) en bas (text-xs gray-500)

Séparateur.

Section formulaire :
- Titre "Répondre à ce chantier"
- Sous-texte : "Présentez-vous et expliquez pourquoi vous êtes le bon artisan pour ce projet."
- Textarea "Votre message" (5 lignes), placeholder "Bonjour, je suis disponible pour réaliser vos travaux..."
- Bouton "Envoyer ma réponse" (blue-600, full width)

Zone d'erreur rouge si besoin.

Design : le résumé du projet est visible mais secondaire. Le textarea est l'élément principal. Bien aéré.
```

---

## 8. Détail Projet + Réponses (Particulier)

```
Crée une page de détail de projet avec les réponses reçues pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Lien retour : "← Retour au tableau de bord"

Section projet (card avec border, padding 6) :
- Titre (2xl bold) + badge statut à droite
- Description complète (gray-700, whitespace-pre-line)
- Métadonnées : catégorie, ville (CP), date de publication

Section réponses :
- Titre "Réponses (2/3)"

Chaque réponse (card avec border) :
- Header : Nom entreprise (bold) + code postal artisan + badge statut réponse
  - "En attente" (jaune), "Acceptée" (vert), "Refusée" (rouge)
- Description artisan (2 lignes, gray-600)
- Message de l'artisan dans un bloc gris-50 avec guillemets français : « message... »
- Date "Reçue le 15 mars 2026"
- Si statut = "en_attente" : 2 boutons
  - "Accepter" (green-600, plein) + "Refuser" (red border, outline)

Montre 3 réponses de démo : une en attente, une acceptée, une refusée.

État vide : "Aucun artisan n'a encore répondu à ce projet."

Design : les boutons Accepter/Refuser doivent être très clairs et bien séparés. La carte de réponse doit mettre en valeur le message de l'artisan.
```

---

## 9. Liste des Conversations

```
Crée une page de liste de conversations pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Header :
- Titre "Mes conversations"
- Sous-titre "Échangez avec les artisans que vous avez acceptés."

Liste de conversations (cards empilées, gap-3) — chaque carte :
- À gauche : avatar rond (initiale du nom, fond blue-100, texte blue-700)
- Centre :
  - Ligne 1 : Nom de l'interlocuteur (bold) + date à droite (text-xs gray-400)
  - Ligne 2 : Titre du projet (text-xs gray-500)
  - Ligne 3 : Dernier message (tronqué, text-sm gray-600)
- À droite : badge rond bleu avec nombre de messages non lus (si > 0)

Carte entière cliquable (hover: border-blue-300).

Montre 4 conversations de démo : une avec 3 non-lus, une avec 1 non-lu, deux sans non-lus.

État vide :
- Icône bulle de chat
- "Aucune conversation pour le moment"
- "Acceptez la réponse d'un artisan pour démarrer une discussion."
- Bouton "Voir mes projets"

Design : style messagerie moderne type WhatsApp/Messenger. Conversations récentes en premier. Badge non-lus bien visible.
```

---

## 10. Chat (Conversation)

```
Crée une interface de chat pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Layout full-height (h-screen - header) en flex-col :

Header du chat :
- Lien "← Retour" à gauche
- Nom de l'interlocuteur (bold) + titre du projet en dessous (text-xs gray-500)
- Border-bottom gray-200

Zone de messages (flex-1, overflow-y-auto, padding) :
- Messages envoyés : bulle bleue (blue-600, text-white), alignée à droite, coin bottom-right carré
- Messages reçus : bulle grise (gray-100, text-gray-900), alignée à gauche, coin bottom-left carré
  - Nom de l'expéditeur au-dessus en text-xs gray-500
- Heure sous chaque bulle (text-xs, blue-200 pour envoyé, gray-400 pour reçu)
- Max-width 75% pour les bulles

Zone de saisie (border-top gray-200, padding) :
- Textarea auto-resize (1 ligne par défaut, max 4)
- Bouton "Envoyer" (blue-600) à droite
- Placeholder "Votre message..."

Montre un échange de 6-8 messages de démo (alternance envoyé/reçu), avec des messages courts et un message long pour voir le wrapping.

Design : propre, moderne, type iMessage/WhatsApp. Les bulles doivent être arrondies et bien espacées. La zone de saisie doit être toujours visible en bas.
```

---

## 11. Profil Artisan Public (SEO)

```
Crée une page de profil artisan public pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Cette page est indexée par Google — design professionnel obligatoire.

Pas de navbar authentifiée. Header public simple : "ArtisanConnect" (logo texte) + "Se connecter" / "S'inscrire"

Section hero (gradient blue-600 vers blue-800, texte blanc) :
- Avatar rond large (initiales "JP", fond white/20, texte blanc, 20x20)
- Nom entreprise : "Peinture Dupont" (2xl bold)
- Nom artisan : "Jean Dupont"
- Zone : "La Roche-sur-Yon (85000) — Rayon 30 km"

Section contenu (fond blanc, card avec negative margin pour chevaucher le hero) :
- Badges des métiers : "Peinture intérieure / extérieure", "Revêtement sols et murs" (badge blue-100 text-blue-800)
- Description : paragraphe de 3-4 lignes sur l'activité
- Infos : SIRET, membre depuis [date]

Section CTA :
- Bouton "Demander un devis gratuit" (blue-600, gros, plein)
- Lien vers inscription

Design : premium, comme une page LinkedIn pour artisans. Le hero gradient donne un côté pro. La card blanche chevauche le hero pour un effet de profondeur. Doit donner confiance.
```

---

## 12. Page Mon Profil (Artisan)

```
Crée une page de gestion de profil artisan pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Titre "Mon profil"

Formulaire en 2 sections :

Section 1 — "Informations personnelles" (card blanche, border, padding) :
- Prénom + Nom (2 inputs sur une ligne)
- Téléphone (optionnel)

Section 2 — "Mon entreprise" (card blanche, border, padding) :
- Nom de l'entreprise *
- SIRET (14 chiffres)
- Description (textarea 3 lignes)
- Code postal * + Rayon d'intervention en km (grid 2 cols)
- Corps de métier * : checkboxes visuelles (border, padding, checked = blue-600 border + blue-50 fond)
  - "Peinture intérieure / extérieure"
  - "Revêtement sols et murs"
  - "Espaces verts et jardinage"

Bouton "Enregistrer les modifications" (blue-600)

Messages succès (vert) ou erreur (rouge) après soumission.

Section danger (card, border-red-200) :
- Titre "Zone de danger"
- "Supprimer mon compte" — texte explicatif + input mot de passe + bouton rouge "Supprimer définitivement"

Design : formulaire structuré en sections claires. La zone de danger est visuellement séparée et intimidante (border rouge, texte d'avertissement).
```

---

## 13. Page Mon Profil (Particulier)

```
Crée une page de gestion de profil particulier pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Titre "Mon profil"

Section 1 — "Informations personnelles" (card blanche) :
- Prénom * + Nom * (grid 2 cols)
- Téléphone (optionnel)

Section 2 — "Adresse" (card blanche) :
- Adresse
- Code postal + Ville (grid 2 cols)

Bouton "Enregistrer" (blue-600)

Section danger identique au profil artisan (suppression compte avec mot de passe).

Design : même style que le profil artisan, plus simple car moins de champs.
```

---

## 14. Mes Devis / Réponses (Artisan)

```
Crée une page "Mes devis" pour un artisan sur "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Pas de navbar.

Titre "Mes devis & réponses"

Liste de réponses envoyées (cards empilées) — chaque card :
- Ligne 1 : Titre du projet (bold) + badge statut à droite
  - "En attente" (jaune), "Acceptée" (vert), "Refusée" (rouge)
- Ligne 2 : Catégorie + Ville (CP) + Date (text-xs gray-500)
- Ligne 3 : Mon message (tronqué 2 lignes, fond gray-50, italique, guillemets)
- Si "acceptée" : bouton "Ouvrir la conversation" (blue-600 outline)

Montre 4 réponses de démo avec les 3 statuts différents.

État vide :
- Icône document
- "Vous n'avez pas encore répondu à un chantier"
- Bouton "Voir les chantiers disponibles"

Design : chaque card doit rendre le statut immédiatement visible. Le bouton conversation ne doit apparaître que pour les acceptées.
```

---

## 15. Onboarding Artisan

```
Crée un formulaire d'onboarding artisan pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Centré, max-w-lg.

Titre "Complétez votre profil artisan"
Sous-titre "Ces informations seront visibles par les particuliers qui recherchent un artisan."

Formulaire :
1. Nom de l'entreprise *
2. SIRET (placeholder "14 chiffres")
3. Description de votre activité (textarea 3 lignes, placeholder "Décrivez vos services, votre expérience...")
4. Code postal * + Rayon d'intervention km (grid 2 cols, default 30)
5. Corps de métier * (1 minimum) — checkboxes visuelles :
   - Chaque option = card cliquable avec checkbox + libellé
   - Sélectionné = border blue-600, fond blue-50
   - 3 options : Peinture, Sols et murs, Espaces verts

Bouton "Valider mon profil" (blue-600, full width)

Design : formulaire accueillant, pas intimidant. Le step des métiers est visuel et interactif.
```

---

## 16. Onboarding Particulier

```
Crée un formulaire d'onboarding particulier pour "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Centré, max-w-lg.

Titre "Complétez votre profil"
Sous-titre "Ces informations nous aident à vous proposer des artisans proches de chez vous."

Formulaire (simple) :
1. Adresse (placeholder "12 rue de la Paix")
2. Code postal + Ville (grid 2 cols)

Bouton "Continuer" (blue-600, full width)

Design : ultra simple, rassurant. Peu de champs = bonne UX d'onboarding.
```

---

## 17. Navbar Artisan

```
Crée une barre de navigation pour l'espace artisan de "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Desktop (sm+) :
- Fond blanc, border-bottom gray-200, sticky top-0, z-40
- Gauche : "ArtisanConnect Pro" (bold lg, blue-600)
- Centre : liens navigation inline :
  - "Chantiers" (feed)
  - "Mes devis" (mes-reponses)
  - "Messages" (conversations)
- Droite : "Mon Profil" (text-sm) + bouton "Se déconnecter" (outline gray-300)

Mobile :
- Logo centré
- Menu hamburger qui ouvre les liens en vertical
- Ou bottom navigation bar avec 4 icônes (Chantiers, Devis, Messages, Profil)

Le lien actif doit être visuellement différent (bold ou underline ou blue-600).

Design : professionnel, sobre, pas trop "tech". L'artisan doit se sentir dans un outil pro.
```

---

## 18. Navbar Particulier

```
Crée une barre de navigation pour l'espace particulier de "ArtisanConnect". React + Tailwind, textes en français, mobile-first, blue-600.

Même structure que la navbar artisan mais avec :
- Logo : "ArtisanConnect" (pas "Pro")
- Liens : "Mes chantiers" (dashboard), "Messages" (conversations), "+ Nouveau projet" (blue-600 highlight)
- Droite : "Mon Profil" + "Se déconnecter"

Mobile : même logique que artisan.
```

---

## Ordre de travail recommandé

1. **Landing page** (c'est la première impression)
2. **Navbars** artisan + particulier (structurent tout le reste)
3. **Pages auth** : inscription + connexion
4. **Dashboard particulier** + nouveau projet + détail projet
5. **Feed artisan** + page répondre + mes devis
6. **Chat** : liste conversations + chat room
7. **Profils** : artisan + particulier
8. **Profil public artisan** (SEO)
9. **Onboarding** artisan + particulier

Pour chaque page, copie le prompt dans v0.dev, récupère le code, et adapte-le au projet (remplace les données de démo par les vraies queries Supabase).
