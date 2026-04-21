// Onboarding flows — Artisan + Particulier
const { useState } = React;

function StepIndicator({ current, total }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 4, flex: 1, maxWidth: 48, borderRadius: 4, background: i < current ? t.primary : i === current ? t.primaryBorder : t.border, transition: 'all 0.3s' }} />
      ))}
    </div>
  );
}

function OnboardingArtisan({ setScreen }) {
  const t = useTheme();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    siret: '', metier: '', cp: '', dept: '85', bio: '',
    categories: [], phone: '',
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleCat = cat => setForm(f => ({ ...f, categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat] }));

  const CATEGORIES = ['Peinture', 'Sols & Revêtements', 'Espaces verts', 'Toiture', 'Électricité', 'Plomberie', 'Maçonnerie', 'Menuiserie', 'Isolation', 'Carrelage'];
  const DEPTS = [{ value: '44', label: '44 – Loire-Atlantique' }, { value: '85', label: '85 – Vendée' }, { value: '49', label: '49 – Maine-et-Loire' }, { value: '79', label: '79 – Deux-Sèvres' }];

  const steps = [
    // Step 0 — Profil pro
    <div key={0}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Votre profil professionnel</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Ces informations sont affichées sur votre profil public.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Numéro SIRET" placeholder="123 456 789 00012" value={form.siret} onChange={set('siret')} required />
        <Input label="Métier / spécialité" placeholder="Ex : Peintre en bâtiment" value={form.metier} onChange={set('metier')} required />
        <Input label="Téléphone professionnel" placeholder="06 XX XX XX XX" value={form.phone} onChange={set('phone')} />
        <Textarea label="Présentation (facultatif)" placeholder="Décrivez votre expérience, vos spécialités, vos atouts..." value={form.bio} onChange={set('bio')} rows={3} />
      </div>
    </div>,

    // Step 1 — Zone d'intervention
    <div key={1}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Votre zone d'intervention</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Les chantiers affichés seront filtrés par votre département.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Code postal de base" placeholder="85000" value={form.cp} onChange={set('cp')} />
        <Select label="Département principal" value={form.dept} onChange={set('dept')} options={DEPTS} />
        <div style={{ background: t.primaryLight, border: `1px solid ${t.primaryBorder}`, borderRadius: t.radiusSm, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: t.primary }}>ℹ️</span>
          <p style={{ fontSize: 13, color: t.primaryText, margin: 0 }}>Pour le lancement, ArtisanConnect couvre principalement la Vendée (85). D'autres départements seront ajoutés prochainement.</p>
        </div>
      </div>
    </div>,

    // Step 2 — Catégories
    <div key={2}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Vos catégories de travaux</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Sélectionnez les types de chantiers sur lesquels vous intervenez.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {CATEGORIES.map(cat => {
          const sel = form.categories.includes(cat);
          return (
            <button key={cat} onClick={() => toggleCat(cat)}
              style={{ padding: '8px 18px', borderRadius: '999px', border: `2px solid ${sel ? t.primary : t.border}`, background: sel ? t.primaryLight : t.surface, color: sel ? t.primaryText : t.text, fontWeight: sel ? 700 : 500, fontSize: 14, cursor: 'pointer', fontFamily: t.font, transition: 'all 0.15s' }}>
              {cat}
            </button>
          );
        })}
      </div>
      {form.categories.length === 0 && <p style={{ color: t.amber, fontSize: 13, marginTop: 16 }}>⚠️ Sélectionnez au moins une catégorie</p>}
    </div>,

    // Step 3 — Abonnement
    <div key={3}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Choisissez votre abonnement</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Accédez aux chantiers de votre zone sans commission.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { id: 'mensuel', label: 'Mensuel', price: '50€/mois', sub: 'Sans engagement', features: ['Accès illimité', 'Profil SEO', 'Messagerie', '0% commission'] },
          { id: 'annuel', label: 'Annuel ⭐', price: '40€/mois', sub: 'Facturé 480€/an — 2 mois offerts', features: ['Tout du mensuel', 'Priorité commerciale', 'Support dédié'], recommended: true },
          { id: 'fondateur', label: 'Fondateur 🚀', price: '25€/mois', sub: '300€/an à vie — 50 places', features: ['Tarif préférentiel à vie', 'Badge Fondateur', 'Accès anticipé'], amber: true },
        ].map(plan => (
          <Card key={plan.id} style={{ padding: '18px 22px', border: `2px solid ${plan.recommended ? t.primary : plan.amber ? t.amberBorder : t.border}`, background: plan.recommended ? t.primaryLight : t.surface, display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }} hover>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{plan.label}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{plan.sub}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {plan.features.map(f => <Tag key={f}>{f}</Tag>)}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: plan.recommended ? t.primary : plan.amber ? t.amber : t.text, fontFamily: t.headingFont }}>{plan.price}</div>
              {plan.recommended && <div style={{ fontSize: 11, color: t.primaryText, fontWeight: 700 }}>Le plus populaire</div>}
            </div>
          </Card>
        ))}
      </div>
    </div>,
  ];

  const isLast = step === steps.length - 1;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 18, color: t.primary, marginBottom: 20 }}>ArtisanConnect</div>
        </div>
        <StepIndicator current={step} total={steps.length} />
        <Card style={{ padding: 36 }}>
          {steps[step]}
          <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
            {step > 0 && <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Retour</Btn>}
            <Btn variant="primary" onClick={() => isLast ? setScreen('feed') : setStep(s => s + 1)} style={{ borderRadius: t.radiusSm }}>
              {isLast ? 'Accéder au feed →' : 'Continuer →'}
            </Btn>
          </div>
        </Card>
        <p style={{ textAlign: 'center', fontSize: 12, color: t.textMuted, marginTop: 16 }}>Étape {step + 1} sur {steps.length}</p>
      </div>
    </div>
  );
}

function OnboardingParticulier({ setScreen }) {
  const t = useTheme();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ville: '', cp: '', phone: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const steps = [
    <div key={0}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Votre localisation</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Pour que les artisans de votre zone voient vos projets.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Ville" placeholder="Challans" value={form.ville} onChange={set('ville')} required />
        <Input label="Code postal" placeholder="85300" value={form.cp} onChange={set('cp')} required />
        <Input label="Téléphone (facultatif)" placeholder="06 XX XX XX XX" value={form.phone} onChange={set('phone')} />
        <div style={{ background: t.greenLight, border: `1px solid ${t.greenBorder}`, borderRadius: t.radiusSm, padding: '12px 16px', display: 'flex', gap: 10 }}>
          <span>🔒</span>
          <p style={{ fontSize: 13, color: t.textSub, margin: 0 }}>Votre numéro de téléphone ne sera jamais partagé avec les artisans avant que vous l'acceptiez.</p>
        </div>
      </div>
    </div>,
    <div key={1}>
      <h2 style={{ fontFamily: t.headingFont, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Tout est prêt ! 🎉</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 28 }}>Votre compte est créé. Vous pouvez maintenant déposer votre premier projet.</p>
      <div style={{ background: t.greenLight, border: `1px solid ${t.greenBorder}`, borderRadius: t.radius, padding: 24, textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Service 100% gratuit</div>
        <div style={{ fontSize: 14, color: t.textSub }}>Vous recevrez jusqu'à 3 devis d'artisans vérifiés dans votre zone.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Décrivez votre projet en quelques lignes', 'Recevez les propositions sous 24h', 'Choisissez l\'artisan qui vous convient'].map((s, i) => (
          <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.primaryLight, color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ fontSize: 14, color: t.textSub }}>{s}</span>
          </div>
        ))}
      </div>
    </div>,
  ];

  const isLast = step === steps.length - 1;

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 18, color: t.primary, marginBottom: 20 }}>ArtisanConnect</div>
        </div>
        <StepIndicator current={step} total={steps.length} />
        <Card style={{ padding: 36 }}>
          {steps[step]}
          <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
            {step > 0 && <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Retour</Btn>}
            <Btn variant="primary" onClick={() => isLast ? setScreen('dashboard') : setStep(s => s + 1)} style={{ borderRadius: t.radiusSm }}>
              {isLast ? 'Déposer mon premier projet →' : 'Continuer →'}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingArtisan, OnboardingParticulier });
