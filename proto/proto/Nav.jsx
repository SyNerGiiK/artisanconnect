// App Shell with sidebar navigation
const { useState } = React;

const NAV_ARTISAN = [
  { id: 'feed', label: 'Chantiers', icon: '🏗️' },
  { id: 'conversations', label: 'Messagerie', icon: '💬', badge: 1 },
  { id: 'profile-public', label: 'Mon profil', icon: '👤' },
  { id: 'pricing', label: 'Abonnement', icon: '💎' },
];
const NAV_PARTICULIER = [
  { id: 'dashboard', label: 'Mes projets', icon: '📋' },
  { id: 'conversations', label: 'Messagerie', icon: '💬', badge: 2 },
  { id: 'profile-particulier', label: 'Mon profil', icon: '👤' },
];

function AppShell({ screen, setScreen, role, setRole, children }) {
  const t = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = role === 'artisan' ? NAV_ARTISAN : NAV_PARTICULIER;
  const user = role === 'artisan' ? MOCK_ARTISAN : MOCK_PARTICULIER;

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${t.navBorder}` }}>
        <div style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, fontSize: 18, color: t.navLogo || t.primary, cursor: 'pointer', letterSpacing: '-0.3px' }}
          onClick={() => setScreen('landing')}>
          ArtisanConnect
        </div>
        {/* Role toggle */}
        <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.07)', borderRadius: t.radiusSm, padding: 3, display: 'flex', gap: 2 }}>
          {['artisan', 'particulier'].map(r => (
            <button key={r} onClick={() => { setRole(r); setScreen(r === 'artisan' ? 'feed' : 'dashboard'); }}
              style={{ flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 700, borderRadius: t.radiusSm, border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: t.font, textTransform: 'capitalize',
                background: role === r ? t.navActiveText : 'transparent',
                color: role === r ? t.navBg : t.navText }}>
              {r === 'artisan' ? '🔨 Artisan' : '🏠 Particulier'}
            </button>
          ))}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => {
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={() => { setScreen(item.id); setMobileOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: t.radiusSm, border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: t.font, fontSize: 14, fontWeight: active ? 700 : 500, textAlign: 'left', width: '100%',
                background: active ? t.navActive : 'transparent',
                color: active ? t.navActiveText : t.navText }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: t.primary, color: '#fff', borderRadius: '999px', padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px', borderTop: `1px solid ${t.navBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={`${user.prenom} ${user.nom}`} size={34} color={t.primary} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.navActiveText || t.navText, fontFamily: t.font, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.prenom} {user.nom}</div>
            <div style={{ fontSize: 11, color: t.navText, fontFamily: t.font }}>{role === 'artisan' ? user.metier : 'Particulier'}</div>
          </div>
          <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.navText, fontSize: 16, padding: 4 }} title="Déconnexion">↩</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: t.font, background: t.bg, overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: t.navBg, borderRight: `1px solid ${t.navBorder}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        className="desktop-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ width: 240, background: t.navBg, height: '100%', overflow: 'auto' }}><SidebarContent /></div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <div style={{ display: 'none', padding: '12px 16px', background: t.navBg, borderBottom: `1px solid ${t.navBorder}`, alignItems: 'center', gap: 12 }}
          className="mobile-topbar">
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.navText, fontSize: 20 }}>☰</button>
          <span style={{ fontFamily: t.headingFont, fontWeight: t.fontWeightHeavy, color: t.navLogo || t.primary, fontSize: 16 }}>ArtisanConnect</span>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { AppShell });
