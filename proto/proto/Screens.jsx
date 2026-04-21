// Project Detail + Chat + Artisan Profile + Pricing
const { useState, useRef, useEffect } = React;

function ProjectDetail({ setScreen }) {
  const t = useTheme();
  const projet = MOCK_MES_PROJETS[0];
  const [reponses, setReponses] = useState(projet.reponses);
  const [boosts, setBoosts] = useState({ boost: false, urgence: false, photos: false });
  const [boostLoading, setBoostLoading] = useState(null);
  const handleBoost = (type) => {
    setBoostLoading(type);
    setTimeout(() => { setBoosts(b => ({ ...b, [type]: true })); setBoostLoading(null); }, 1200);
  };
  const [toast, setToast] = useState(null);

  const handleAction = (id, action) => {
    setReponses(prev => prev.map(r => r.id === id ? { ...r, statut: action === 'accept' ? 'acceptee' : 'refusee' } : r));
    setToast(action === 'accept' ? '✓ Réponse acceptée — conversation créée !' : '✗ Réponse refusée');
    setTimeout(() => setToast(null), 3000);
    if (action === 'accept') setTimeout(() => setScreen('conversations'), 1500);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 860, margin: '0 auto' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: t.text, color: '#fff', padding: '10px 24px', borderRadius: t.radius, fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: t.shadowHover }}>
          {toast}
        </div>
      )}

      <button onClick={() => setScreen('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 14, marginBottom: 24, fontFamily: t.font }}>← Mes projets</button>

      {/* Project header */}
      <Card style={{ padding: '28px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Tag color="primary">{projet.categorie}</Tag>
              <StatusBadge statut={projet.statut} />
            </div>
            <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 24, letterSpacing: '-0.3px' }}>{projet.titre}</h1>
          </div>
          <Btn variant="secondary" size="sm">Clôturer le projet</Btn>
        </div>
        <p style={{ color: t.textSub, fontSize: 14, lineHeight: 1.6 }}>Déposé le {new Date(projet.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · Challans (85300)</p>
      </Card>

      {/* Boost options */}
      {projet.statut === 'ouvert' && (
        <Card style={{ padding: '22px 24px', marginBottom: 24, border: `1px solid #c7d2fe`, background: '#eef2ff' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#312e81', fontFamily: t.headingFont, marginBottom: 4 }}>Boostez votre projet</div>
            <div style={{ fontSize: 13, color: '#4338ca' }}>Augmentez vos chances de trouver l'artisan idéal plus rapidement.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { type: 'boost', icon: '🚀', label: 'Boost visibilité', desc: 'Votre projet apparaît en premier dans le fil des artisans.', price: '4,99 €', doneLabel: 'Projet boosté' },
              { type: 'urgence', icon: '⚡', label: 'Badge Urgence', desc: 'Signalez vos travaux comme urgents pour attirer des artisans disponibles rapidement.', price: '2,99 €', doneLabel: 'Badge activé' },
              { type: 'photos', icon: '📷', label: 'Pack Photos', desc: "Ajoutez jusqu'à 5 photos pour illustrer vos travaux.", price: '3,99 €', doneLabel: 'Photos débloquées' },
            ].map(opt => (
              <div key={opt.type} style={{ background: boosts[opt.type] ? t.greenLight : '#fff', border: `1px solid ${boosts[opt.type] ? t.greenBorder : t.border}`, borderRadius: t.radiusSm, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: t.textMuted, flex: 1, lineHeight: 1.5 }}>{opt.desc}</div>
                {boosts[opt.type] ? (
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.green }}>✓ {opt.doneLabel}</span>
                ) : (
                  <button onClick={() => handleBoost(opt.type)} disabled={boostLoading !== null}
                    style={{ marginTop: 4, background: boostLoading === opt.type ? t.primaryBorder : '#4f46e5', color: '#fff', border: 'none', borderRadius: t.radiusSm, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: t.font, opacity: boostLoading && boostLoading !== opt.type ? 0.5 : 1, transition: 'all 0.15s' }}>
                    {boostLoading === opt.type ? 'Redirection…' : opt.price}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Responses */}
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
        Réponses reçues <span style={{ color: t.textMuted, fontWeight: 400, fontSize: 14 }}>({reponses.length}/3)</span>
      </h2>

      {reponses.length === 0 ? (
        <Card><EmptyState icon="📬" title="Aucune réponse pour l'instant" desc="Les artisans de votre zone seront notifiés. Revenez bientôt !" /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reponses.map(rep => (
            <Card key={rep.id} style={{ padding: '22px 24px', border: `1.5px solid ${rep.statut === 'acceptee' ? t.greenBorder : rep.statut === 'refusee' ? '#fca5a5' : t.border}`, background: rep.statut === 'acceptee' ? t.greenLight : rep.statut === 'refusee' ? t.redLight : t.surface }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar name={rep.artisan} size={42} color={t.primary} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{rep.artisan}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars rating={rep.note} />
                      <span style={{ fontSize: 12, color: t.textMuted }}>{rep.note}/5</span>
                    </div>
                  </div>
                </div>
                <StatusBadge statut={rep.statut} />
              </div>

              <div style={{ background: rep.statut === 'acceptee' ? '#fff' : rep.statut === 'refusee' ? '#fff' : t.bg, borderRadius: t.radiusSm, padding: '12px 16px', marginBottom: 14 }}>
                <p style={{ fontSize: 14, color: t.textSub, lineHeight: 1.6, margin: 0 }}>"{rep.message}"</p>
              </div>

              {rep.statut === 'en_attente' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn variant="green" size="sm" onClick={() => handleAction(rep.id, 'accept')}>✓ Accepter — créer une conversation</Btn>
                  <Btn variant="danger" size="sm" onClick={() => handleAction(rep.id, 'refuse')}>✗ Refuser</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setScreen('profile-public')}>Voir le profil</Btn>
                </div>
              )}
              {rep.statut === 'acceptee' && (
                <Btn variant="primary" size="sm" onClick={() => setScreen('conversations')}>Ouvrir la conversation →</Btn>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ConversationsScreen({ setScreen, role }) {
  const t = useTheme();
  const convs = MOCK_CONVERSATIONS.filter(c => role === 'artisan' ? c.role === 'particulier' : true);
  return (
    <div style={{ padding: '32px 28px', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 28, letterSpacing: '-0.5px', marginBottom: 24 }}>Messagerie</h1>
      {convs.length === 0 ? (
        <Card><EmptyState icon="💬" title="Aucune conversation" desc="Vos conversations apparaîtront ici une fois qu'un particulier aura accepté votre réponse." /></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {convs.map(conv => (
            <Card key={conv.id} style={{ padding: '18px 22px', cursor: 'pointer' }} hover onClick={() => setScreen('chat')}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar name={conv.interlocuteur} size={46} color={t.primary} />
                  {conv.unread > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: t.primary, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: conv.unread > 0 ? 700 : 600, fontSize: 15 }}>{conv.interlocuteur}</span>
                    <span style={{ fontSize: 12, color: t.textMuted }}>{conv.lastTime}</span>
                  </div>
                  <div style={{ fontSize: 13, color: t.textSub }}><span style={{ color: t.textMuted, fontWeight: 500 }}>{conv.projet} · </span>{conv.lastMessage}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatScreen({ setScreen }) {
  const t = useTheme();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const conv = MOCK_CONVERSATIONS[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: `m${Date.now()}`, auteur: 'Sophie Martin', isOwn: true, contenu: input, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 860, margin: '0 auto', padding: '0 0' }}>
      {/* Chat header */}
      <div style={{ padding: '14px 24px', borderBottom: `1px solid ${t.border}`, background: t.surface, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setScreen('conversations')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 18, padding: '0 4px' }}>←</button>
        <Avatar name={conv.interlocuteur} size={40} color={t.primary} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{conv.interlocuteur}</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>{conv.projet}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Btn variant="ghost" size="sm" onClick={() => setScreen('profile-public')}>Voir le profil</Btn>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isOwn ? 'flex-end' : 'flex-start' }}>
            {!msg.isOwn && <span style={{ fontSize: 11, color: t.textMuted, marginBottom: 3, marginLeft: 4 }}>{msg.auteur}</span>}
            <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: msg.isOwn ? `${t.radius} ${t.radius} 4px ${t.radius}` : `${t.radius} ${t.radius} ${t.radius} 4px`, background: msg.isOwn ? t.primary : t.surface, color: msg.isOwn ? '#fff' : t.text, fontSize: 14, lineHeight: 1.5, boxShadow: t.shadow, border: msg.isOwn ? 'none' : `1px solid ${t.border}` }}>
              {msg.contenu}
            </div>
            <span style={{ fontSize: 11, color: t.textMuted, marginTop: 3, marginRight: msg.isOwn ? 2 : 0, marginLeft: msg.isOwn ? 0 : 4 }}>{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.border}`, background: t.surface, display: 'flex', gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Écrire un message… (Entrée pour envoyer)"
          style={{ flex: 1, padding: '10px 14px', borderRadius: t.radiusSm, border: `1.5px solid ${t.border}`, background: t.bg, color: t.text, fontSize: 14, fontFamily: t.font, outline: 'none' }} />
        <Btn variant="primary" onClick={send} style={{ borderRadius: t.radiusSm, padding: '10px 16px' }}>→</Btn>
      </div>
    </div>
  );
}

function ArtisanProfile({ setScreen }) {
  const t = useTheme();
  const a = MOCK_ARTISAN;
  return (
    <div style={{ padding: '32px 28px', maxWidth: 760, margin: '0 auto' }}>
      <button onClick={() => setScreen('feed')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 14, marginBottom: 24, fontFamily: t.font }}>← Retour</button>

      {/* Profile card */}
      <Card style={{ padding: '32px 36px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 20 }}>
          <Avatar name={`${a.prenom} ${a.nom}`} size={72} color={t.primary} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 24 }}>{a.prenom} {a.nom}</h1>
              <span style={{ background: t.primaryLight, color: t.primaryText, border: `1px solid ${t.primaryBorder}`, borderRadius: '999px', padding: '2px 12px', fontSize: 12, fontWeight: 700 }}>✓ Vérifié</span>
            </div>
            <p style={{ color: t.textSub, fontSize: 15, marginBottom: 8 }}>{a.metier}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stars rating={a.note} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>{a.note}</span>
                <span style={{ color: t.textMuted, fontSize: 13 }}>({a.avis} avis)</span>
              </div>
              <Tag>📍 {a.ville} ({a.departement})</Tag>
              <Tag>{a.projetsRealises} projets réalisés</Tag>
            </div>
          </div>
        </div>
        <Divider />
        <p style={{ color: t.textSub, fontSize: 14, lineHeight: 1.7 }}>{a.bio}</p>
      </Card>

      {/* Categories */}
      <Card style={{ padding: '22px 24px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, fontFamily: t.headingFont }}>Spécialités</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {a.categories.map(c => <Tag key={c} color="primary">{c}</Tag>)}
        </div>
      </Card>

      {/* SIRET */}
      <Card style={{ padding: '18px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 18 }}>🏢</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>SIRET vérifié</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>{a.siret}</div>
          </div>
        </div>
      </Card>

      <Btn variant="primary" full size="lg" onClick={() => setScreen('project-detail')} style={{ borderRadius: t.radius }}>Contacter cet artisan →</Btn>
    </div>
  );
}

function PricingScreen({ setScreen }) {
  const t = useTheme();
  const [billing, setBilling] = useState('annuel');

  const plans = [
    { id: 'mensuel', label: 'Mensuel', price: '50€', period: '/mois', sub: 'Sans engagement', features: ['Accès illimité aux chantiers', 'Profil public SEO', 'Messagerie directe', 'Zéro commission'], cta: 'Commencer', variant: 'secondary' },
    { id: 'annuel', label: 'Annuel ⭐', price: '40€', period: '/mois', sub: 'Facturé 480€/an — 2 mois offerts', features: ['Tout du mensuel inclus', '2 mois offerts', 'Priorité commerciale', 'Support prioritaire'], cta: 'Choisir l\'annuel', variant: 'primary', recommended: true },
    { id: 'fondateur', label: 'Offre Fondateurs 🚀', price: '25€', period: '/mois', sub: 'Facturé 300€/an à vie — 50 places', features: ['Tarif préférentiel à vie', 'Tout du plan annuel', 'Badge « Fondateur »', 'Accès anticipé nouveautés'], cta: 'Devenir fondateur', variant: 'amber', amber: true },
  ];

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 32, letterSpacing: '-0.5px', marginBottom: 8 }}>Tarifs artisans</h1>
        <p style={{ color: t.textSub, fontSize: 16 }}>Simple, transparent, sans mauvaise surprise</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {plans.map(plan => (
          <Card key={plan.id} style={{ padding: '32px 28px', position: 'relative', border: `2px solid ${plan.recommended ? t.primary : plan.amber ? t.amberBorder : t.border}`, background: plan.recommended ? t.primaryLight : t.surface }}>
            {plan.recommended && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#78350f', borderRadius: '999px', padding: '4px 16px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                LE PLUS POPULAIRE
              </div>
            )}
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: t.headingFont }}>{plan.label}</h3>
            <p style={{ fontSize: 12, color: plan.amber ? t.amber : t.textMuted, marginBottom: 20, fontWeight: plan.amber ? 700 : 400 }}>{plan.sub}</p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: plan.recommended ? t.primary : plan.amber ? t.amber : t.text, fontFamily: t.headingFont }}>{plan.price}</span>
              <span style={{ color: t.textMuted, fontSize: 14 }}>{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: t.textSub }}>
                  <span style={{ color: plan.recommended ? t.primary : plan.amber ? t.amber : t.green, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Btn variant={plan.variant} full onClick={() => setScreen('onboarding-artisan')} style={{ borderRadius: t.radiusSm }}>{plan.cta}</Btn>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Card style={{ display: 'inline-block', padding: '20px 40px' }}>
          <div style={{ fontSize: 14, color: t.textSub, marginBottom: 4 }}>Des questions ? On vous répond.</div>
          <div style={{ fontWeight: 700, color: t.primary }}>contact@artisanconnect.fr</div>
        </Card>
      </div>
    </div>
  );
}

function ParticulierProfile() {
  const t = useTheme();
  const [form, setForm] = useState({ prenom: 'Sophie', nom: 'Martin', email: 'sophie.martin@gmail.com', phone: '06 12 34 56 78', ville: 'Challans', cp: '85300' });
  const [saved, setSaved] = useState(false);
  const set = k => v => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 28, letterSpacing: '-0.5px', marginBottom: 4 }}>Mon profil</h1>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Mettez à jour vos informations personnelles.</p>

      {saved && (
        <div style={{ background: t.greenLight, border: `1px solid ${t.greenBorder}`, borderRadius: t.radiusSm, padding: '10px 16px', marginBottom: 20, fontSize: 14, fontWeight: 600, color: t.green }}>
          ✓ Profil mis à jour avec succès
        </div>
      )}

      {/* Avatar */}
      <Card style={{ padding: '24px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Avatar name={`${form.prenom} ${form.nom}`} size={64} color={t.primary} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{form.prenom} {form.nom}</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>Particulier · {form.ville}</div>
          <Btn variant="secondary" size="sm">Changer la photo</Btn>
        </div>
      </Card>

      {/* Infos personnelles */}
      <Card style={{ padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: t.headingFont }}>Informations personnelles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Prénom" value={form.prenom} onChange={set('prenom')} />
            <Input label="Nom" value={form.nom} onChange={set('nom')} />
          </div>
          <Input label="Adresse email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Téléphone" placeholder="06 XX XX XX XX" value={form.phone} onChange={set('phone')} />
        </div>
      </Card>

      {/* Localisation */}
      <Card style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, fontFamily: t.headingFont }}>Localisation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <Input label="Ville" value={form.ville} onChange={set('ville')} />
            <Input label="Code postal" value={form.cp} onChange={set('cp')} />
          </div>
          <div style={{ background: t.primaryLight, border: `1px solid ${t.primaryBorder}`, borderRadius: t.radiusSm, padding: '10px 14px', fontSize: 13, color: t.primaryText }}>
            ℹ️ Votre adresse exacte n'est jamais communiquée aux artisans.
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn variant="secondary">Annuler</Btn>
        <Btn variant="primary" onClick={handleSave} style={{ borderRadius: t.radiusSm }}>Enregistrer les modifications</Btn>
      </div>

      <Divider />

      {/* Danger zone */}
      <Card style={{ padding: '20px 24px', border: `1px solid #fca5a5`, background: t.redLight }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: t.red, marginBottom: 6 }}>Zone de danger</div>
        <p style={{ fontSize: 13, color: t.textSub, marginBottom: 12 }}>La suppression de votre compte est irréversible. Tous vos projets et conversations seront effacés.</p>
        <Btn variant="danger" size="sm">Supprimer mon compte</Btn>
      </Card>
    </div>
  );
}

Object.assign(window, { ProjectDetail, ConversationsScreen, ChatScreen, ArtisanProfile, PricingScreen, ParticulierProfile });
