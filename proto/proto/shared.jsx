// Shared UI components
const { useState, useRef, useEffect } = React;

function StatusBadge({ statut }) {
  const t = useTheme();
  const configs = {
    ouvert: { label: 'Ouvert', bg: t.greenLight, color: t.green, border: t.greenBorder },
    en_cours: { label: 'En cours', bg: t.primaryLight, color: t.primaryText, border: t.primaryBorder },
    termine: { label: 'Terminé', bg: t.bg, color: t.textMuted, border: t.border },
    annule: { label: 'Annulé', bg: t.redLight, color: t.red, border: '#fca5a5' },
    en_attente: { label: 'En attente', bg: t.amberLight, color: t.amber, border: t.amberBorder },
    acceptee: { label: 'Acceptée', bg: t.greenLight, color: t.green, border: t.greenBorder },
    refusee: { label: 'Refusée', bg: t.redLight, color: t.red, border: '#fca5a5' },
  };
  const c = configs[statut] || { label: statut, bg: t.bg, color: t.textMuted, border: t.border };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: '999px', padding: '2px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}

function Btn({ children, variant = 'primary', size = 'md', onClick, style = {}, disabled = false, full = false }) {
  const t = useTheme();
  const [hov, setHov] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    fontFamily: t.font, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.15s', borderRadius: t.radiusSm,
    width: full ? '100%' : undefined, opacity: disabled ? 0.55 : 1,
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '15px' : '14px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '13px 24px' : '9px 18px',
  };
  const variants = {
    primary: { background: hov ? t.primaryDark : t.primary, color: '#fff', boxShadow: hov ? t.shadowPrimary : 'none' },
    secondary: { background: hov ? t.surfaceHover : t.surface, color: t.text, border: `1px solid ${t.border}`, boxShadow: hov ? t.shadow : 'none' },
    ghost: { background: hov ? t.primaryLight : 'transparent', color: t.primaryText, border: `1px solid ${hov ? t.primaryBorder : 'transparent'}` },
    green: { background: hov ? t.green : t.green, color: '#fff', filter: hov ? 'brightness(1.1)' : 'none', boxShadow: hov ? `0 4px 14px ${t.green}44` : 'none' },
    amber: { background: hov ? t.amber : t.amber, color: '#fff', filter: hov ? 'brightness(1.1)' : 'none' },
    danger: { background: hov ? t.red : t.redLight, color: hov ? '#fff' : t.red, border: `1px solid ${hov ? t.red : '#fca5a5'}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function Card({ children, style = {}, hover = false, onClick }) {
  const t = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: t.surface, borderRadius: t.radius,
        border: `1px solid ${hov ? t.primaryBorder : t.border}`,
        boxShadow: hov ? t.shadowHover : t.shadow,
        transition: 'all 0.2s', cursor: onClick ? 'pointer' : 'default',
        transform: hov ? 'translateY(-2px)' : 'none',
        ...style,
      }}>
      {children}
    </div>
  );
}

function Avatar({ name, size = 40, color }) {
  const t = useTheme();
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  const bg = color || t.primaryLight;
  const fg = color ? '#fff' : t.primaryText;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0, fontFamily: t.font }}>
      {initials}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  const t = useTheme();
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ width: 64, height: 64, borderRadius: t.radius, background: t.primaryLight, color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 8, fontFamily: t.headingFont }}>{title}</div>
      <div style={{ color: t.textSub, fontSize: 14, maxWidth: 320, margin: '0 auto 24px' }}>{desc}</div>
      {action}
    </div>
  );
}

function Input({ label, placeholder, type = 'text', value, onChange, required }) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: t.font }}>{label}{required && <span style={{ color: t.red }}> *</span>}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ padding: '10px 14px', borderRadius: t.radiusSm, border: `1.5px solid ${focus ? t.primary : t.border}`, background: t.surface, color: t.text, fontSize: 14, fontFamily: t.font, outline: 'none', transition: 'border-color 0.15s', boxShadow: focus ? `0 0 0 3px ${t.primaryLight}` : 'none' }} />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, rows = 4 }) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: t.font }}>{label}</label>}
      <textarea placeholder={placeholder} value={value} onChange={e => onChange && onChange(e.target.value)} rows={rows}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ padding: '10px 14px', borderRadius: t.radiusSm, border: `1.5px solid ${focus ? t.primary : t.border}`, background: t.surface, color: t.text, fontSize: 14, fontFamily: t.font, outline: 'none', resize: 'vertical', transition: 'border-color 0.15s', boxShadow: focus ? `0 0 0 3px ${t.primaryLight}` : 'none' }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  const t = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: t.font }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: t.radiusSm, border: `1.5px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 14, fontFamily: t.font, outline: 'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Tag({ children, color }) {
  const t = useTheme();
  return (
    <span style={{ background: color === 'primary' ? t.primaryLight : t.surfaceHover, color: color === 'primary' ? t.primaryText : t.textSub, borderRadius: '999px', padding: '3px 10px', fontSize: 12, fontWeight: 600, border: `1px solid ${color === 'primary' ? t.primaryBorder : t.border}` }}>
      {children}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: '1px' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

function Divider() {
  const t = useTheme();
  return <div style={{ height: 1, background: t.border, margin: '20px 0' }} />;
}

function AlertBanner({ type = 'warning', title, desc, action }) {
  const t = useTheme();
  const cfg = {
    warning: { bg: t.amberLight, border: t.amberBorder, color: t.amber, icon: '⚠️' },
    info: { bg: t.primaryLight, border: t.primaryBorder, color: t.primaryText, icon: 'ℹ️' },
    success: { bg: t.greenLight, border: t.greenBorder, color: t.green, icon: '✓' },
  }[type];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: t.radius, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 16 }}>{cfg.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 4, fontFamily: t.font }}>{title}</div>
        {desc && <div style={{ fontSize: 13, color: t.textSub }}>{desc}</div>}
        {action && <div style={{ marginTop: 10 }}>{action}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { StatusBadge, Btn, Card, Avatar, EmptyState, Input, Textarea, Select, Tag, Stars, Divider, AlertBanner });
