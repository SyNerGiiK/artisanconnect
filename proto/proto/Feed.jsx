// Artisan Feed + Particulier Dashboard + New Project
const { useState } = React;

function ArtisanFeed({ setScreen }) {
  const t = useTheme();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [responded, setResponded] = useState(new Set());
  const [showReply, setShowReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  const categories = ['all', 'Peinture', 'Sols & Revêtements', 'Espaces verts', 'Toiture', 'Électricité'];
  const projets = MOCK_PROJETS.filter(p =>
    (filter === 'all' || p.categorie === filter) &&
    (search === '' || p.titre.toLowerCase().includes(search.toLowerCase()) || p.ville.toLowerCase().includes(search.toLowerCase()))
  );

  const handleReply = (id) => {
    setResponded(s => new Set([...s, id]));
    setShowReply(null);
    setReplyText('');
    setScreen('conversations');
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 28, letterSpacing: '-0.5px', marginBottom: 4 }}>Chantiers disponibles</h1>
        <p style={{ color: t.textSub, fontSize: 14 }}>Bonjour Marc — {projets.length} chantier{projets.length > 1 ? 's' : ''} dans votre zone</p>
      </div>

      {/* Subscription warning */}
      <AlertBanner type="warning" title="Abonnement Premium requis"
        desc="Accédez aux coordonnées des particuliers et envoyez vos devis en illimité."
        action={<Btn variant="amber" size="sm" onClick={() => setScreen('pricing')}>Voir les offres Premium →</Btn>}
      />

      {/* Filters */}
      <div style={{ margin: '20px 0 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textMuted, fontSize: 15 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: t.radiusSm, border: `1.5px solid ${t.border}`, background: t.surface, fontSize: 14, fontFamily: t.font, outline: 'none', color: t.text, boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '7px 14px', borderRadius: '999px', fontSize: 13, fontWeight: 600, fontFamily: t.font, border: `1.5px solid ${filter === cat ? t.primary : t.border}`, background: filter === cat ? t.primaryLight : t.surface, color: filter === cat ? t.primaryText : t.textSub, cursor: 'pointer', transition: 'all 0.15s' }}>
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project list */}
      {projets.length === 0 ? (
        <Card style={{ marginTop: 16 }}>
          <EmptyState icon="🏗️" title="Aucun chantier disponible" desc="Il n'y a pas encore de chantiers correspondant à vos critères dans votre zone d'intervention." />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projets.map(projet => {
            const isResponded = responded.has(projet.id);
            const isFull = projet.reponses >= 3;
            return (
              <Card key={projet.id} style={{ padding: '22px 24px' }} hover>
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: t.text, fontFamily: t.headingFont, margin: 0, flex: 1, minWidth: 0 }}>{projet.titre}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: t.textMuted, background: t.bg, border: `1px solid ${t.border}`, borderRadius: '999px', padding: '2px 10px', whiteSpace: 'nowrap' }}>{projet.reponses}/3</span>
                    <StatusBadge statut={projet.statut} />
                  </div>
                </div>
                {/* Badges row */}
                {(projet.is_boosted || projet.is_urgent) && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                    {projet.is_boosted && <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: '999px', padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>🚀 Boosté</span>}
                    {projet.is_urgent && <span style={{ background: t.redLight, color: t.red, borderRadius: '999px', padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>⚡ Urgent</span>}
                  </div>
                )}

                <p style={{ color: t.textSub, fontSize: 14, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{projet.description}</p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <Tag color="primary">{projet.categorie}</Tag>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: t.surfaceHover, color: t.textSub, borderRadius: '999px', padding: '3px 10px', fontSize: 12, fontWeight: 600, border: `1px solid ${t.border}`, whiteSpace: 'nowrap' }}>📍 {projet.ville}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: t.surfaceHover, color: t.textSub, borderRadius: '999px', padding: '3px 10px', fontSize: 12, fontWeight: 600, border: `1px solid ${t.border}`, whiteSpace: 'nowrap' }}>📅 {new Date(projet.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                </div>

                {/* Reply modal */}
                {showReply === projet.id && (
                  <div style={{ marginBottom: 12, background: t.bg, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 16 }}>
                    <Textarea label="Votre message" placeholder="Bonjour, je suis disponible pour ce chantier. Je vous propose..." value={replyText} onChange={setReplyText} rows={3} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                      <Btn variant="secondary" size="sm" onClick={() => setShowReply(null)}>Annuler</Btn>
                      <Btn variant="primary" size="sm" onClick={() => handleReply(projet.id)}>Envoyer ma réponse →</Btn>
                    </div>
                  </div>
                )}

                {isResponded ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.green, background: t.greenLight, border: `1px solid ${t.greenBorder}`, borderRadius: t.radiusSm, padding: '6px 14px' }}>
                    ✓ Vous avez répondu
                  </span>
                ) : isFull ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.textMuted, background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, padding: '6px 14px' }}>
                    ✗ 3 artisans ont déjà répondu
                  </span>
                ) : showReply === projet.id ? null : (
                  <Btn variant="primary" onClick={() => setShowReply(projet.id)}>Répondre à ce chantier →</Btn>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ParticulierDashboard({ setScreen }) {
  const t = useTheme();
  const [showNewProject, setShowNewProject] = useState(false);

  if (showNewProject) return <NewProjectForm setScreen={setScreen} onBack={() => setShowNewProject(false)} />;

  return (
    <div style={{ padding: '32px 28px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 28, letterSpacing: '-0.5px', marginBottom: 4 }}>Mes projets</h1>
          <p style={{ color: t.textSub, fontSize: 14 }}>Bonjour Sophie — gérez vos projets de travaux ici.</p>
        </div>
        <Btn variant="primary" onClick={() => setShowNewProject(true)} style={{ borderRadius: t.radius, boxShadow: t.shadowPrimary }}>+ Nouveau projet</Btn>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[{ label: 'Projets actifs', value: '2', color: t.primary }, { label: 'Réponses reçues', value: '3', color: t.green }, { label: 'En cours', value: '1', color: t.amber }].map(s => (
          <Card key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: t.headingFont, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: t.textSub }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_MES_PROJETS.map(projet => (
          <Card key={projet.id} style={{ padding: '22px 24px', cursor: 'pointer' }} hover onClick={() => setScreen('project-detail')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 16, fontFamily: t.headingFont, marginBottom: 4 }}>{projet.titre}</h3>
                <div style={{ display: 'flex', gap: 8 }}><Tag color="primary">{projet.categorie}</Tag></div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: t.textMuted, background: t.bg, border: `1px solid ${t.border}`, borderRadius: '999px', padding: '2px 10px' }}>{projet.reponses.length} réponse{projet.reponses.length > 1 ? 's' : ''}</span>
                <StatusBadge statut={projet.statut} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: t.textMuted }}>Déposé le {new Date(projet.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {projet.reponses.length > 0 && projet.statut === 'ouvert' && (
                <span style={{ fontSize: 13, color: t.primary, fontWeight: 600 }}>Voir les réponses →</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewProjectForm({ setScreen, onBack }) {
  const t = useTheme();
  const [form, setForm] = useState({ titre: '', categorie: '', description: '', ville: '', cp: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const CATS = [{ value: '', label: 'Choisir une catégorie' }, 'Peinture', 'Sols & Revêtements', 'Espaces verts', 'Toiture', 'Électricité', 'Plomberie', 'Maçonnerie', 'Menuiserie'].map(c => typeof c === 'string' ? { value: c, label: c } : c);

  return (
    <div style={{ padding: '32px 28px', maxWidth: 640, margin: '0 auto' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 14, marginBottom: 24, fontFamily: t.font }}>← Retour</button>
      <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 26, marginBottom: 6 }}>Déposer un projet</h1>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Décrivez vos besoins pour recevoir jusqu'à 3 devis gratuits d'artisans qualifiés.</p>
      <Card style={{ padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="Titre du projet" placeholder="Ex : Peinture salon et couloir" value={form.titre} onChange={set('titre')} required />
          <Select label="Catégorie de travaux" value={form.categorie} onChange={set('categorie')} options={CATS} />
          <Textarea label="Description détaillée" placeholder="Décrivez vos travaux : surface, type de matériaux, contraintes particulières, délai souhaité…" value={form.description} onChange={set('description')} rows={5} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <Input label="Ville" placeholder="Challans" value={form.ville} onChange={set('ville')} required />
            <Input label="Code postal" placeholder="85300" value={form.cp} onChange={set('cp')} required />
          </div>
          <div style={{ background: t.primaryLight, border: `1px solid ${t.primaryBorder}`, borderRadius: t.radiusSm, padding: '10px 14px', fontSize: 13, color: t.primaryText }}>
            🔒 Vos coordonnées ne seront transmises qu'après acceptation d'un artisan.
          </div>
          <Btn variant="primary" full size="lg" onClick={() => setScreen('dashboard')} style={{ borderRadius: t.radius }}>Publier mon projet →</Btn>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ArtisanFeed, ParticulierDashboard, NewProjectForm });
