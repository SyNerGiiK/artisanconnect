// Landing page + Auth screens
const { useState } = React;

function LandingPage({ setScreen, setRole }) {
  const t = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goAuth = (role, type) => {
    setRole(role);
    setScreen(type === 'login' ? 'login' : 'signup');
  };

  return (
    <div style={{ fontFamily: t.font, background: '#fff', minHeight: '100vh', color: t.text }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${t.borderLight}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 20, color: t.primary }}>ArtisanConnect</div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['Comment ça marche', 'Tarifs', 'Nos métiers'].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, fontWeight: 500, color: t.textSub, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" onClick={() => goAuth('particulier', 'login')}>Se connecter</Btn>
            <Btn variant="primary" onClick={() => goAuth('particulier', 'signup')}>S'inscrire</Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${t.primaryLight} 0%, #fff 50%, ${t.primaryLight} 100%)`, padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: `${t.primary}10`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: t.primaryLight, border: `1px solid ${t.primaryBorder}`, borderRadius: '999px', padding: '6px 16px', fontSize: 13, fontWeight: 600, color: t.primaryText, marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Lancement en Vendée (85)
          </div>
          <h1 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 20, color: t.text, position: 'relative', zIndex: 1 }}>
            Trouvez le bon artisan<br />
            <span style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', paddingBottom: 4 }}>près de chez vous</span>
          </h1>
          <p style={{ fontSize: 18, color: t.textSub, lineHeight: 1.7, marginBottom: 36 }}>
            Décrivez votre projet, recevez jusqu'à <strong style={{ color: t.text }}>3 devis d'artisans vérifiés</strong>.<br />
            Gratuit pour les particuliers, sans commission.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn variant="primary" size="lg" onClick={() => goAuth('particulier', 'signup')} style={{ borderRadius: t.radius, boxShadow: t.shadowPrimary }}>
              Je cherche un artisan →
            </Btn>
            <Btn variant="secondary" size="lg" onClick={() => goAuth('artisan', 'signup')} style={{ borderRadius: t.radius }}>
              Je suis artisan
            </Btn>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: t.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.5px', marginBottom: 12 }}>Comment ça marche ?</h2>
            <p style={{ color: t.textSub, fontSize: 16 }}>3 étapes simples pour trouver votre artisan</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { step: '1', icon: '✏️', title: 'Décrivez votre projet', desc: 'Renseignez les détails de votre chantier : type de travaux, localisation, description.' },
              { step: '2', icon: '📬', title: 'Recevez des devis', desc: 'Jusqu\'à 3 artisans vérifiés de votre zone vous contactent avec leur proposition.' },
              { step: '3', icon: '✅', title: 'Choisissez le meilleur', desc: 'Comparez les propositions, échangez par messagerie et choisissez l\'artisan idéal.' },
            ].map(item => (
              <Card key={item.step} style={{ padding: 32, position: 'relative' }} hover>
                <div style={{ width: 48, height: 48, borderRadius: t.radiusSm, background: t.primaryLight, color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{item.icon}</div>
                <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 48, fontWeight: 900, color: t.borderLight, lineHeight: 1 }}>{item.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, fontFamily: t.headingFont }}>{item.title}</h3>
                <p style={{ color: t.textSub, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For particuliers */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: t.greenLight, color: t.green, border: `1px solid ${t.greenBorder}`, borderRadius: '999px', padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>100% gratuit</div>
            <h2 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.5px', marginBottom: 12 }}>Particuliers : vos travaux en toute sérénité</h2>
            <p style={{ color: t.textSub, fontSize: 15, marginBottom: 24 }}>Fini le démarchage intempestif. Avec ArtisanConnect, vous gardez le contrôle.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Service 100% gratuit pour les particuliers', 'Maximum 3 artisans par projet', 'Artisans vérifiés (SIRET obligatoire)', 'Échangez par messagerie sécurisée', 'Vos coordonnées restent privées'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: t.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: t.textSub }}>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}><Btn variant="green" size="lg" onClick={() => goAuth('particulier', 'signup')} style={{ borderRadius: t.radius }}>Publier mon projet gratuitement →</Btn></div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${t.greenLight}, #fff)`, borderRadius: t.radiusLg, padding: 40, border: `1px solid ${t.greenBorder}` }}>
            {[{ num: '0€', label: 'pour le particulier' }, { num: '3 max', label: 'artisans par projet' }, { num: '< 24h', label: 'pour recevoir un devis' }].map(s => (
              <Card key={s.label} style={{ padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: t.green, fontFamily: t.headingFont }}>{s.num}</div>
                <div style={{ color: t.textSub, fontSize: 14 }}>{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For artisans */}
      <section style={{ padding: '80px 24px', background: t.primaryLight, borderTop: `1px solid ${t.borderLight}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <Card style={{ padding: 40 }}>
            {[{ num: '0%', label: 'de commission' }, { num: '50€', label: '/ mois sans engagement' }, { num: '∞', label: 'chantiers accessibles' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: t.primaryLight, borderRadius: t.radiusSm, marginBottom: 10 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: t.primary, fontFamily: t.headingFont }}>{s.num}</div>
                <div style={{ color: t.textSub, fontSize: 14 }}>{s.label}</div>
              </div>
            ))}
          </Card>
          <div>
            <div style={{ display: 'inline-block', background: t.primaryLight, color: t.primaryText, border: `1px solid ${t.primaryBorder}`, borderRadius: '999px', padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>Pour les pros</div>
            <h2 style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.5px', marginBottom: 12 }}>Artisans : des chantiers sans les arnaques</h2>
            <p style={{ color: t.textSub, fontSize: 15, marginBottom: 24 }}>Un abonnement fixe, des leads qualifiés, zéro surprise sur la facture.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Abonnement fixe — pas de frais par contact', 'Répondez à autant de chantiers que vous voulez', 'Leads qualifiés dans votre zone', 'Profil public référencé sur Google', 'Messagerie directe avec les clients'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: t.primary, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: t.textSub }}>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}><Btn variant="primary" size="lg" onClick={() => goAuth('artisan', 'signup')} style={{ borderRadius: t.radius }}>Rejoindre ArtisanConnect →</Btn></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: `1px solid ${t.border}`, padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 16, color: t.primary, marginBottom: 8 }}>ArtisanConnect</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>La plateforme équitable pour vos travaux</div>
          </div>
          {[{ title: 'Produit', links: ['Comment ça marche', 'Tarifs'] }, { title: 'Légal', links: ['CGU', 'CGV', 'Mentions légales'] }, { title: 'Contact', links: ['contact@artisanconnect.fr', 'Vendée (85)'] }].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: t.text }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0', borderTop: `1px solid ${t.borderLight}`, paddingTop: 16, textAlign: 'center', fontSize: 12, color: t.textMuted }}>
          © 2026 ArtisanConnect. Tous droits réservés.
        </div>
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

function LoginScreen({ setScreen, role }) {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 22, color: t.primary, marginBottom: 8 }}>ArtisanConnect</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: t.headingFont, marginBottom: 6 }}>Connexion</h1>
          <p style={{ color: t.textSub, fontSize: 14 }}>Bienvenue, {role === 'artisan' ? 'artisan' : 'particulier'} !</p>
        </div>
        <Card style={{ padding: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input label="Adresse email" placeholder="vous@exemple.fr" type="email" value={email} onChange={setEmail} />
            <Input label="Mot de passe" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
            <div style={{ textAlign: 'right' }}><a href="#" style={{ fontSize: 13, color: t.primaryText, textDecoration: 'none' }}>Mot de passe oublié ?</a></div>
            <Btn variant="primary" full size="lg" onClick={() => setScreen(role === 'artisan' ? 'feed' : 'dashboard')} style={{ borderRadius: t.radius, marginTop: 4 }}>Se connecter</Btn>
          </div>
          <Divider />
          <p style={{ textAlign: 'center', fontSize: 13, color: t.textSub }}>
            Pas encore de compte ?{' '}
            <a href="#" style={{ color: t.primaryText, fontWeight: 600, textDecoration: 'none' }} onClick={() => setScreen('signup')}>S'inscrire</a>
          </p>
        </Card>
      </div>
    </div>
  );
}

function SignupScreen({ setScreen, role, setRole }) {
  const t = useTheme();
  const [step, setStep] = useState(1);
  const [chosenRole, setChosenRole] = useState(role);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '' });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  if (step === 1) return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 22, color: t.primary, marginBottom: 8 }}>ArtisanConnect</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: t.headingFont, marginBottom: 6 }}>Créer un compte</h1>
          <p style={{ color: t.textSub, fontSize: 14 }}>Vous êtes…</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[{ role: 'particulier', emoji: '🏠', title: 'Particulier', desc: 'Je cherche des artisans pour mes travaux' }, { role: 'artisan', emoji: '🔨', title: 'Artisan', desc: 'Je propose mes services aux particuliers' }].map(opt => (
            <div key={opt.role} onClick={() => setChosenRole(opt.role)}
              style={{ padding: 24, borderRadius: t.radius, border: `2px solid ${chosenRole === opt.role ? t.primary : t.border}`, background: chosenRole === opt.role ? t.primaryLight : t.surface, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{opt.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 4 }}>{opt.title}</div>
              <div style={{ fontSize: 12, color: t.textSub }}>{opt.desc}</div>
            </div>
          ))}
        </div>
        <Btn variant="primary" full size="lg" onClick={() => { setRole(chosenRole); setStep(2); }} style={{ borderRadius: t.radius }}>Continuer →</Btn>
        <p style={{ textAlign: 'center', fontSize: 13, color: t.textSub, marginTop: 16 }}>
          Déjà inscrit ? <a href="#" style={{ color: t.primaryText, fontWeight: 600, textDecoration: 'none' }} onClick={() => setScreen('login')}>Se connecter</a>
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 22, color: t.primary, marginBottom: 8 }}>ArtisanConnect</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: t.headingFont, marginBottom: 4 }}>Vos informations</h1>
          <p style={{ color: t.textSub, fontSize: 13 }}>Étape 2 / 3 — Compte {chosenRole}</p>
        </div>
        <Card style={{ padding: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Prénom" placeholder="Sophie" value={form.prenom} onChange={set('prenom')} required />
              <Input label="Nom" placeholder="Martin" value={form.nom} onChange={set('nom')} required />
            </div>
            <Input label="Email" placeholder="vous@exemple.fr" type="email" value={form.email} onChange={set('email')} required />
            <Input label="Mot de passe" placeholder="8 caractères minimum" type="password" value={form.password} onChange={set('password')} required />
            <Btn variant="primary" full size="lg" onClick={() => setScreen(chosenRole === 'artisan' ? 'onboarding-artisan' : 'onboarding-particulier')} style={{ borderRadius: t.radius, marginTop: 4 }}>
              Créer mon compte →
            </Btn>
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
            En créant un compte, vous acceptez nos <a href="#" style={{ color: t.primaryText }}>CGU</a> et notre <a href="#" style={{ color: t.primaryText }}>politique de confidentialité</a>.
          </p>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { LandingPage, LoginScreen, SignupScreen });
