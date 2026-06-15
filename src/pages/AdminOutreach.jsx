import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { defaultPalette as p, defaultType as type } from '../theme.js';
import { useNarrow } from '../hooks.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const STATUSES = [
  { key: 'not_contacted', label: 'Not contacted', color: p.inkMuted },
  { key: 'dm_sent',       label: 'DM sent',       color: p.accent },
  { key: 'replied',       label: 'Replied',       color: '#3D7A4E' },
  { key: 'signed_up',     label: 'Signed up',     color: '#3D7A4E' },
  { key: 'declined',      label: 'Declined',      color: '#B53D2F' },
  { key: 'ghosted',       label: 'Ghosted',       color: p.inkMuted },
  { key: 'blocked',       label: 'Blocked',       color: '#B53D2F' },
];

const SERVICE_OPTS = ['', 'hair', 'nails', 'lashes', 'brows', 'makeup', 'barber', 'skin', 'wax'];

const SERVICE_LABEL = {
  en: { hair: 'hair', nails: 'nail', lashes: 'lash', brows: 'brow', makeup: 'makeup', barber: 'fade', skin: 'skincare', wax: 'wax' },
  es: { hair: 'cabello', nails: 'uñas', lashes: 'pestañas', brows: 'cejas', makeup: 'maquillaje', barber: 'corte', skin: 'facial', wax: 'cera' },
};

function firstNameOf(prospect) {
  return (prospect.full_name || '').split(/[\s|—,·]/).map(s => s.trim()).filter(Boolean)[0] || '';
}

// Honest pricing line: $0/month + 5% only on a won booking. Matches the /pros
// honesty rewrite — do NOT reintroduce "lifetime $0" / "no commission" claims.
const SIGNUP_LINK = 'glossi.cc/signup?role=salon';

function cityOf(prospect, lang) {
  return prospect.city_guess || (lang === 'es' ? 'el Valle' : 'the Valley');
}

// Pre-rendered IG DM. Longer, more visual context — IG DMs allow that.
function renderDM(prospect) {
  const lang = prospect.language_guess === 'es' ? 'es' : 'en';
  const firstName = firstNameOf(prospect);
  const primaryService = (prospect.service_guess || '').split('|')[0];
  const svc = SERVICE_LABEL[lang][primaryService];
  const city = cityOf(prospect, lang);

  if (lang === 'es') {
    return [
      firstName ? `Hola ${firstName}, ` : 'Hola, ',
      svc ? `vi tu trabajo de ${svc} y quedé enamorado` : 'vi tu trabajo y quedé enamorado',
      ` — felicidades. Estoy lanzando Glossi, una forma gratis para que las clientas de ${city} te encuentren: publican el servicio, la fecha y el presupuesto, y tú envías una oferta rápida.`,
      ' Sin mensualidad, sin pagar por "leads" — solo pagas 5% cuando realmente reservas a la clienta.',
      ` Estamos sumando un primer grupo de salones del Valle — ¿te apunto? Son ~2 min: ${SIGNUP_LINK}`,
    ].join('');
  }
  return [
    firstName ? `Hey ${firstName}, ` : 'Hey, ',
    svc ? `saw your ${svc} work` : 'saw your work',
    ` — it's gorgeous. I'm launching Glossi, a free way for ${city} clients to find local pros: they post the service, date, and budget, and you send a quick bid.`,
    ' No monthly fee, no lead fees — you only pay 5% when you actually book the client.',
    ` We're onboarding a first group of RGV salons now — want me to set you up? Takes ~2 min: ${SIGNUP_LINK}`,
  ].join('');
}

// Pre-rendered SMS. Tighter, more conversational than the IG DM — SMS is
// more intimate. No "STOP to opt out" because these go from the founder's
// personal iPhone, not an automated A2P system.
function renderSMS(prospect) {
  const lang = prospect.language_guess === 'es' ? 'es' : 'en';
  const firstName = firstNameOf(prospect);
  const city = cityOf(prospect, lang);
  if (lang === 'es') {
    return `Hola ${firstName || 'amiga'} — soy del equipo de Glossi, una forma gratis para que las clientas de ${city} encuentren estilistas. Publican lo que buscan, tú mandas tu oferta. Sin mensualidad — solo pagas 5% cuando reservas: ${SIGNUP_LINK} — pregúntame lo que sea 💛`;
  }
  return `Hey ${firstName || 'there'} — I'm with Glossi, a free way for ${city} clients to find stylists. They post what they want, you send a bid. No monthly fee — you only pay 5% when you book: ${SIGNUP_LINK} — happy to answer any qs 💛`;
}

export default function AdminOutreach() {
  const isPhone = useNarrow();
  const navigate = useNavigate();

  const [gate, setGate] = useState({ checking: true, ok: false });
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [rgvOnly, setRgvOnly] = useState(true);
  const [phoneOnly, setPhoneOnly] = useState(false);

  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);
  const [copiedSms, setCopiedSms] = useState(null);

  // Auth gate
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!isSupabaseConfigured) { setGate({ checking: false, ok: false }); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setGate({ checking: false, ok: false }); return; }
      const { data, error } = await supabase.rpc('is_glossi_admin');
      if (cancelled) return;
      setGate({ checking: false, ok: !error && data === true, email: user.email });
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Fetch prospects once auth is confirmed
  useEffect(() => {
    if (!gate.ok) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('outreach_prospects')
        .select('*')
        .order('rgv_match', { ascending: false })
        .order('follower_count', { ascending: false, nullsFirst: false });
      if (cancelled) return;
      if (!error && data) setProspects(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [gate.ok]);

  const stats = useMemo(() => {
    const out = { total: prospects.length };
    for (const s of STATUSES) out[s.key] = 0;
    for (const r of prospects) out[r.status] = (out[r.status] || 0) + 1;
    const denom = out.dm_sent + out.replied + out.signed_up + out.declined + out.ghosted + out.blocked;
    out.replyRate = denom > 0 ? Math.round(((out.replied + out.signed_up) / denom) * 100) : 0;
    out.conversionRate = out.dm_sent + out.replied + out.signed_up > 0
      ? Math.round((out.signed_up / (out.dm_sent + out.replied + out.signed_up)) * 100)
      : 0;
    return out;
  }, [prospects]);

  const filtered = useMemo(() => {
    return prospects.filter((r) => {
      if (rgvOnly && !r.rgv_match) return false;
      if (phoneOnly && !r.phone_extracted) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (serviceFilter && !(r.service_guess || '').includes(serviceFilter)) return false;
      if (langFilter !== 'all' && r.language_guess !== langFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(r.ig_handle.includes(q) || (r.full_name || '').toLowerCase().includes(q) || (r.bio || '').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [prospects, statusFilter, serviceFilter, langFilter, rgvOnly, phoneOnly, search]);

  const updateStatus = async (id, status) => {
    const updates = { status };
    if (status === 'dm_sent') updates.dm_sent_at = new Date().toISOString();
    if (status === 'replied') updates.replied_at = new Date().toISOString();
    setProspects(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('outreach_prospects').update(updates).eq('id', id);
  };

  const updateNotes = async (id, notes) => {
    setProspects(ps => ps.map(p => p.id === id ? { ...p, notes } : p));
    await supabase.from('outreach_prospects').update({ notes }).eq('id', id);
  };

  const copyDM = async (prospect) => {
    const dm = renderDM(prospect);
    await navigator.clipboard.writeText(dm);
    setCopied(prospect.id);
    if (prospect.status === 'not_contacted') {
      await updateStatus(prospect.id, 'dm_sent');
    }
    setTimeout(() => setCopied(null), 1800);
  };

  const copySMS = async (prospect) => {
    const sms = renderSMS(prospect);
    await navigator.clipboard.writeText(sms);
    setCopiedSms(prospect.id);
    if (prospect.status === 'not_contacted') {
      await updateStatus(prospect.id, 'dm_sent');
    }
    setTimeout(() => setCopiedSms(null), 1800);
  };

  if (gate.checking) {
    return <div style={pageWrap}><div style={loadingStyle}>Checking access…</div></div>;
  }
  if (!gate.ok) {
    return (
      <div style={pageWrap}>
        <div style={{ maxWidth: 480, margin: '80px auto', padding: 32, background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 20, textAlign: 'center' }}>
          <h2 style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 36, fontWeight: type.displayWeight, margin: '0 0 12px', color: p.ink }}>Admin only</h2>
          <p style={{ fontSize: 14, color: p.inkSoft, lineHeight: 1.55, margin: '0 0 22px' }}>
            {gate.email
              ? <>You're signed in as <code style={{ background: p.surface2, padding: '2px 6px', borderRadius: 4 }}>{gate.email}</code> but you're not in the admin whitelist. Add yourself by running this in the Supabase SQL editor:<br /><br /><code style={{ display: 'block', background: p.surface2, padding: 10, borderRadius: 6, fontSize: 12, textAlign: 'left' }}>insert into public.admin_emails (email) values ('{gate.email}');</code></>
              : <>You need to sign in first. <Link to="/signup" style={{ color: p.accent }}>Sign in here</Link>, then come back.</>
            }
          </p>
          <Link to="/" style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, letterSpacing: '0.14em', textTransform: 'uppercase' }}>← back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      {/* Header */}
      <div style={{ padding: isPhone ? '16px 18px' : '20px 36px', borderBottom: `0.5px solid ${p.line}`, background: p.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
          <Link to="/" style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, fontWeight: type.displayWeight, color: p.accent, textDecoration: 'none', letterSpacing: '-0.02em' }}>glossi</Link>
          <span style={{ fontFamily: type.mono, fontSize: 10, letterSpacing: '0.18em', color: p.inkMuted, textTransform: 'uppercase' }}>OUTREACH · ADMIN</span>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isPhone ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 8 }}>
          <Stat label="Total"        value={stats.total}              />
          <Stat label="Not contacted" value={stats.not_contacted}     />
          <Stat label="DM sent"      value={stats.dm_sent}             accent />
          <Stat label="Replied"      value={stats.replied}             accent />
          <Stat label="Signed up"    value={stats.signed_up}           accent />
          <Stat label="Conv. rate"   value={`${stats.conversionRate}%`} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: isPhone ? '14px 18px' : '16px 36px', borderBottom: `0.5px solid ${p.line}`, background: p.surface2, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Search handle, name, bio…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', border: `0.5px solid ${p.line}`, borderRadius: 99, background: p.bg, color: p.ink, outline: 'none', minWidth: 220 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={selectStyle}>
          <option value="">All services</option>
          {SERVICE_OPTS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} style={selectStyle}>
          <option value="all">EN + ES</option>
          <option value="en">EN bio</option>
          <option value="es">ES bio</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: p.inkSoft, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={rgvOnly} onChange={(e) => setRgvOnly(e.target.checked)} />
          RGV only
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: p.inkSoft, cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={phoneOnly} onChange={(e) => setPhoneOnly(e.target.checked)} />
          Has phone
        </label>
        <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkMuted, marginLeft: 'auto' }}>{filtered.length} shown</span>
      </div>

      {/* List */}
      <div style={{ padding: isPhone ? '8px 0' : '8px 18px' }}>
        {loading && <div style={loadingStyle}>Loading prospects…</div>}
        {!loading && filtered.map((r) => (
          <ProspectRow
            key={r.id}
            prospect={r}
            isPhone={isPhone}
            expanded={expandedId === r.id}
            onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
            onCopyDM={() => copyDM(r)}
            onCopySMS={() => copySMS(r)}
            copied={copied === r.id}
            copiedSms={copiedSms === r.id}
            onStatus={(s) => updateStatus(r.id, s)}
            onNotes={(n) => updateNotes(r.id, n)}
          />
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: p.inkSoft, fontSize: 14 }}>No prospects match these filters.</div>
        )}
      </div>
    </div>
  );
}

function ProspectRow({ prospect, isPhone, expanded, onToggle, onCopyDM, onCopySMS, copied, copiedSms, onStatus, onNotes }) {
  const status = STATUSES.find(s => s.key === prospect.status) || STATUSES[0];
  const followers = prospect.follower_count == null ? '—' : prospect.follower_count.toLocaleString();
  const phone = prospect.phone_extracted;
  const phoneFmt = phone ? `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}` : null;
  return (
    <div style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 14, padding: isPhone ? 14 : 16, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: isPhone ? 10 : 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://www.instagram.com/${prospect.ig_handle}/`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: type.body, fontWeight: 700, color: p.ink, textDecoration: 'none', fontSize: 15 }}>
              @{prospect.ig_handle}
            </a>
            <span style={{ fontFamily: type.mono, fontSize: 11, color: p.inkSoft }}>{followers}</span>
            {prospect.language_guess === 'es' && <span style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: p.accent, background: p.accentSoft, padding: '2px 6px', borderRadius: 4 }}>ES</span>}
            {prospect.verified && <span style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: p.inkSoft, background: p.surface2, padding: '2px 6px', borderRadius: 4 }}>✓</span>}
            {phone && <span style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#3D7A4E', background: '#E8F2EB', padding: '2px 6px', borderRadius: 4 }}>☎ {phoneFmt}</span>}
          </div>
          <div style={{ fontSize: 12, color: p.inkSoft, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prospect.full_name}{prospect.service_guess ? ` · ${prospect.service_guess.split('|').join(', ')}` : ''}
          </div>
        </div>
        <select value={prospect.status} onChange={(e) => onStatus(e.target.value)} style={{ ...selectStyle, borderColor: status.color, color: status.color, fontWeight: 600, minWidth: 140 }}>
          {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={onCopyDM} style={{ background: copied ? p.accent : p.ink, color: p.bg, border: 0, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {copied ? '✓ Copied + DM sent' : 'Copy DM'}
        </button>
        {phone && (
          <button onClick={onCopySMS} style={{ background: copiedSms ? p.accent : 'transparent', color: copiedSms ? p.bg : '#3D7A4E', border: `0.5px solid ${copiedSms ? p.accent : '#3D7A4E'}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {copiedSms ? '✓ SMS copied' : 'Copy SMS'}
          </button>
        )}
        {phone && (
          <a href={`sms:+1${phone}`} style={{ background: 'transparent', color: '#3D7A4E', border: `0.5px solid #3D7A4E`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Open Messages →
          </a>
        )}
        <a href={`https://www.instagram.com/${prospect.ig_handle}/`} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: p.ink, border: `0.5px solid ${p.line}`, padding: '8px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          IG →
        </a>
        <button onClick={onToggle} style={{ background: 'transparent', color: p.inkSoft, border: 0, padding: '8px 6px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {expanded ? '▴' : '▾'}
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${p.line}`, display: 'grid', gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 6 }}>Bio</div>
            <div style={{ fontSize: 13, color: p.ink, lineHeight: 1.5, whiteSpace: 'pre-wrap', marginBottom: 12 }}>{prospect.bio || <em style={{ color: p.inkMuted }}>no bio</em>}</div>
            {prospect.external_url && (
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginRight: 8 }}>Link</span>
                <a href={prospect.external_url} target="_blank" rel="noopener noreferrer" style={{ color: p.accent, wordBreak: 'break-all' }}>{prospect.external_url}</a>
              </div>
            )}
            {prospect.sample_location && (
              <div style={{ fontSize: 12, color: p.inkSoft }}>
                <span style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginRight: 8 }}>Location</span>
                {prospect.sample_location}
              </div>
            )}
          </div>
          <div>
            <div style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 6 }}>Pre-rendered DM ({prospect.language_guess === 'es' ? 'ES' : 'EN'})</div>
            <div style={{ background: p.surface2, padding: 12, borderRadius: 8, fontSize: 13, lineHeight: 1.55, color: p.ink, whiteSpace: 'pre-wrap', marginBottom: 12 }}>{renderDM(prospect)}</div>
            {phone && (
              <>
                <div style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 6 }}>SMS draft ({prospect.language_guess === 'es' ? 'ES' : 'EN'}) — sends to {phoneFmt}</div>
                <div style={{ background: '#E8F2EB', padding: 12, borderRadius: 8, fontSize: 13, lineHeight: 1.55, color: p.ink, whiteSpace: 'pre-wrap', marginBottom: 12, borderLeft: `3px solid #3D7A4E` }}>{renderSMS(prospect)}</div>
              </>
            )}
            <div style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 6 }}>Notes</div>
            <textarea
              defaultValue={prospect.notes || ''}
              onBlur={(e) => e.target.value !== (prospect.notes || '') && onNotes(e.target.value)}
              placeholder="Add note (saved on blur)…"
              style={{ width: '100%', padding: 10, fontSize: 13, fontFamily: 'inherit', border: `0.5px solid ${p.line}`, borderRadius: 8, background: p.bg, color: p.ink, outline: 'none', minHeight: 60, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ background: p.surface, border: `0.5px solid ${p.line}`, borderRadius: 10, padding: '8px 12px' }}>
      <div style={{ fontFamily: type.mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: p.inkMuted, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 24, fontWeight: type.displayWeight, color: accent ? p.accent : p.ink, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

const pageWrap = { background: p.bg, minHeight: '100vh', color: p.ink, fontFamily: type.body };
const loadingStyle = { padding: 80, textAlign: 'center', color: p.inkSoft, fontSize: 14 };
const selectStyle = {
  padding: '7px 10px',
  fontSize: 12,
  fontFamily: 'inherit',
  background: p.bg,
  border: `0.5px solid ${p.line}`,
  borderRadius: 99,
  color: p.ink,
  cursor: 'pointer',
  outline: 'none',
};
