// Theme context + 3 visual directions
const THEMES = {
  classique: {
    name: 'Classique',
    bg: '#f9fafb', surface: '#ffffff', surfaceHover: '#f3f4f6',
    border: '#e5e7eb', borderLight: '#f9fafb',
    text: '#111827', textSub: '#6b7280', textMuted: '#9ca3af',
    primary: '#2563eb', primaryDark: '#1d4ed8', primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe', primaryText: '#1d4ed8',
    green: '#16a34a', greenLight: '#f0fdf4', greenBorder: '#bbf7d0',
    amber: '#d97706', amberLight: '#fffbeb', amberBorder: '#fde68a',
    red: '#dc2626', redLight: '#fef2f2',
    navBg: '#ffffff', navText: '#374151', navBorder: '#e5e7eb',
    navActive: '#eff6ff', navActiveText: '#1d4ed8',
    radius: '12px', radiusSm: '8px', radiusLg: '16px',
    shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    shadowHover: '0 8px 25px rgba(0,0,0,0.10)',
    shadowPrimary: '0 4px 14px rgba(37,99,235,0.25)',
    font: "'DM Sans', sans-serif",
    headingFont: "'DM Sans', sans-serif",
    fontWeightHeavy: '800',
  },
  pro: {
    name: 'Pro Sombre',
    bg: '#f1f5f9', surface: '#ffffff', surfaceHover: '#f8fafc',
    border: '#e2e8f0', borderLight: '#f1f5f9',
    text: '#0f172a', textSub: '#475569', textMuted: '#94a3b8',
    primary: '#3b82f6', primaryDark: '#2563eb', primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe', primaryText: '#2563eb',
    green: '#059669', greenLight: '#ecfdf5', greenBorder: '#a7f3d0',
    amber: '#d97706', amberLight: '#fffbeb', amberBorder: '#fde68a',
    red: '#dc2626', redLight: '#fef2f2',
    navBg: '#0f172a', navText: '#94a3b8', navBorder: '#1e293b',
    navActive: 'rgba(59,130,246,0.15)', navActiveText: '#60a5fa',
    navLogo: '#f1f5f9',
    radius: '8px', radiusSm: '6px', radiusLg: '12px',
    shadow: '0 1px 3px rgba(0,0,0,0.06)',
    shadowHover: '0 6px 20px rgba(0,0,0,0.12)',
    shadowPrimary: '0 4px 14px rgba(59,130,246,0.3)',
    font: "'DM Sans', sans-serif",
    headingFont: "'DM Sans', sans-serif",
    fontWeightHeavy: '700',
  },
  artisan: {
    name: 'Artisan Chaud',
    bg: '#faf8f5', surface: '#ffffff', surfaceHover: '#f5f0e8',
    border: '#e8ddd0', borderLight: '#f5f0e8',
    text: '#2c1a10', textSub: '#7c6255', textMuted: '#a89080',
    primary: '#c2714f', primaryDark: '#a85c3c', primaryLight: '#fdf4ef',
    primaryBorder: '#f0c4ac', primaryText: '#a85c3c',
    green: '#5a8a3c', greenLight: '#f2f7ee', greenBorder: '#c4dbb4',
    amber: '#b8860b', amberLight: '#fdfaec', amberBorder: '#e8d48c',
    red: '#c0392b', redLight: '#fdf3f2',
    navBg: '#2c1a10', navText: '#c8b0a0', navBorder: '#3d2418',
    navActive: 'rgba(194,113,79,0.2)', navActiveText: '#f0c4ac',
    navLogo: '#faf8f5',
    radius: '14px', radiusSm: '8px', radiusLg: '20px',
    shadow: '0 1px 4px rgba(44,26,16,0.07)',
    shadowHover: '0 8px 24px rgba(44,26,16,0.13)',
    shadowPrimary: '0 4px 14px rgba(194,113,79,0.35)',
    font: "'DM Sans', sans-serif",
    headingFont: "'Playfair Display', serif",
    fontWeightHeavy: '700',
  },
};

const ThemeContext = React.createContext(THEMES.classique);
const useTheme = () => React.useContext(ThemeContext);

// Mock data
const MOCK_ARTISAN = {
  id: 'a1', prenom: 'Marc', nom: 'Dubois',
  metier: 'Peintre en bâtiment', siret: '123 456 789 00012',
  ville: 'La Roche-sur-Yon', departement: '85',
  bio: 'Artisan peintre avec 15 ans d\'expérience, spécialisé dans la rénovation intérieure et la décoration. Devis gratuit, travaux soignés.',
  note: 4.8, avis: 23, projetsRealises: 47,
  categories: ['Peinture', 'Sols & Revêtements'],
  abonnement: true,
  avatar: null,
};

const MOCK_PARTICULIER = {
  id: 'p1', prenom: 'Sophie', nom: 'Martin',
  ville: 'Challans', departement: '85',
};

const MOCK_PROJETS = [
  { id: '1', titre: 'Peinture salon et couloir', description: 'Rénovation complète de la peinture du salon (25m²) et du couloir (12m²). Murs et plafonds. Couleur au choix.', categorie: 'Peinture', ville: 'Challans', code_postal: '85300', statut: 'ouvert', reponses: 1, is_urgent: false, is_boosted: true, created_at: '2026-04-18' },
  { id: '2', titre: 'Pose carrelage salle de bain', description: 'Dépose ancien carrelage et pose nouveau carrelage 60x60 dans salle de bain de 8m².', categorie: 'Sols & Revêtements', ville: 'Saint-Gilles-Croix-de-Vie', code_postal: '85800', statut: 'ouvert', reponses: 2, is_urgent: true, is_boosted: false, created_at: '2026-04-19' },
  { id: '3', titre: 'Taille haie et entretien jardin', description: 'Taille d\'une haie de thuyas de 30m linéaires (2m de haut), débroussaillage et évacuation des déchets verts.', categorie: 'Espaces verts', ville: 'Les Sables-d\'Olonne', code_postal: '85100', statut: 'ouvert', reponses: 0, is_urgent: false, is_boosted: false, created_at: '2026-04-20' },
  { id: '4', titre: 'Réfection toiture maison principale', description: 'Maison de 120m² avec toiture en tuiles. Plusieurs tuiles cassées suite aux intempéries. Devis pour réparation ou remplacement complet.', categorie: 'Toiture', ville: 'Fontenay-le-Comte', code_postal: '85200', statut: 'ouvert', reponses: 1, is_urgent: true, is_boosted: false, created_at: '2026-04-17' },
  { id: '5', titre: 'Installation climatisation réversible', description: 'Fourniture et installation d\'une climatisation réversible dans une pièce de 20m². Marque de votre choix.', categorie: 'Électricité / Plomberie', ville: 'La Roche-sur-Yon', code_postal: '85000', statut: 'ouvert', reponses: 3, is_urgent: false, is_boosted: false, created_at: '2026-04-16' },
];

const MOCK_MES_PROJETS = [
  { id: 'p1', titre: 'Peinture salon et couloir', categorie: 'Peinture', statut: 'ouvert', reponses: [{ id: 'r1', artisan: 'Marc Dubois', statut: 'en_attente', message: 'Bonjour, je suis disponible pour ce chantier. Je vous propose une visite gratuite pour établir un devis précis.', note: 4.8 }, { id: 'r2', artisan: 'Pierre Lefevre', statut: 'en_attente', message: 'Artisan qualifié RGE, 12 ans d\'expérience en peinture déco. Disponible rapidement.', note: 4.5 }], created_at: '2026-04-15' },
  { id: 'p2', titre: 'Réfection salle de bain', categorie: 'Plomberie', statut: 'en_cours', reponses: [{ id: 'r3', artisan: 'Alain Moreau', statut: 'acceptee', message: 'Je peux commencer la semaine prochaine.', note: 4.9 }], created_at: '2026-03-20' },
  { id: 'p3', titre: 'Taille de haie', categorie: 'Espaces verts', statut: 'termine', reponses: [{ id: 'r4', artisan: 'Jean Garnier', statut: 'acceptee', message: 'Travaux réalisés avec soin.', note: 4.7 }], created_at: '2026-02-10' },
];

const MOCK_CONVERSATIONS = [
  { id: 'c1', projet: 'Peinture salon et couloir', interlocuteur: 'Marc Dubois', lastMessage: 'Je passerai mardi matin si ça vous convient !', lastTime: '10:32', unread: 2, role: 'artisan' },
  { id: 'c2', projet: 'Pose carrelage salle de bain', interlocuteur: 'Sophie Martin', lastMessage: 'Merci pour votre devis, pouvez-vous préciser...', lastTime: 'Hier', unread: 0, role: 'particulier' },
];

const MOCK_MESSAGES = [
  { id: 'm1', auteur: 'Marc Dubois', isOwn: false, contenu: 'Bonjour Sophie, merci pour votre intérêt. Je peux venir faire un passage gratuit pour évaluer le chantier.', time: '09:15' },
  { id: 'm2', auteur: 'Sophie Martin', isOwn: true, contenu: 'Bonjour Marc ! Oui avec plaisir. Vous êtes disponible quand ?', time: '09:42' },
  { id: 'm3', auteur: 'Marc Dubois', isOwn: false, contenu: 'Je peux passer mardi 22 avril en matinée, vers 10h. Est-ce que ça vous convient ?', time: '10:05' },
  { id: 'm4', auteur: 'Sophie Martin', isOwn: true, contenu: 'Parfait pour mardi ! Voici l\'adresse : 12 rue des Lilas, Challans 85300.', time: '10:18' },
  { id: 'm5', auteur: 'Marc Dubois', isOwn: false, contenu: 'Noté ! Je passerai mardi matin si ça vous convient !', time: '10:32' },
];

Object.assign(window, { THEMES, ThemeContext, useTheme, MOCK_ARTISAN, MOCK_PARTICULIER, MOCK_PROJETS, MOCK_MES_PROJETS, MOCK_CONVERSATIONS, MOCK_MESSAGES });
