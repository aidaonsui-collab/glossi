import SalonPhoto from '../../components/SalonPhoto.jsx';
import TrustBadge from '../../components/TrustBadge.jsx';
import { IOSStatusBar } from '../IOSFrame.jsx';
import { Eyebrow, Pulse, Stars, LangChip } from '../atoms.jsx';
import { T, BIDS, GUIDES } from '../data.js';

export default function Home({ p, type, lang, setLang, onPostRequest, onOpenGuide, onOpenSalon }) {
  const t = T[lang];
  return (
    <div style={{ background: p.bg, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <IOSStatusBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '54px 20px 4px' }}>
        <div style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 24, color: p.ink, letterSpacing: '-0.02em', fontStyle: 'italic' }}>glossi</div>
        <LangChip lang={lang} setLang={setLang} p={p} type={type} />
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, fontWeight: 500 }}>{t.greeting}</div>
        <div style={{ fontFamily: type.body, fontSize: 16, color: p.ink, fontWeight: 600, marginTop: 1 }}>{t.user}</div>
      </div>

      <div style={{ padding: '22px 20px 14px' }}>
        <div style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 44, lineHeight: 0.96, color: p.ink, letterSpacing: '-0.025em' }}>{t.heroLine1}</div>
        <div style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 44, lineHeight: 0.96, color: p.accent, letterSpacing: '-0.025em', fontStyle: 'italic', marginTop: 2 }}>{t.heroLine2}</div>
        <div style={{ fontFamily: type.body, fontSize: 14, lineHeight: 1.45, color: p.inkSoft, marginTop: 14, maxWidth: 320 }}>{t.heroSub}</div>
      </div>

      <div style={{ margin: '8px 20px 0', padding: '10px 14px', background: p.surface, borderRadius: 14, border: `0.5px solid ${p.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Pulse color={p.success} />
        <div style={{ flex: 1, fontFamily: type.body, fontSize: 12, color: p.ink, fontWeight: 600 }}>
          <span style={{ fontFamily: type.mono, fontVariantNumeric: 'tabular-nums' }}>23</span> {t.livePulse}
        </div>
        <div style={{ fontFamily: type.mono, fontSize: 10.5, color: p.inkMuted, letterSpacing: '0.04em' }}>78501</div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <button onClick={onPostRequest} style={{
          width: '100%', border: 0, cursor: 'pointer', background: p.ink, color: p.bg,
          padding: '18px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: type.body, fontSize: 15, fontWeight: 600,
        }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 20, fontStyle: 'italic' }}>{t.cta}</span>
            <span style={{ fontFamily: type.body, fontSize: 11.5, color: p.inkMuted, fontWeight: 500 }}>{t.sendSub}</span>
          </span>
          <span style={{ width: 36, height: 36, borderRadius: 999, background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.ink }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </button>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <Eyebrow c={p.inkMuted}>01 · {t.editorial}</Eyebrow>
        <div style={{ fontFamily: type.display, fontWeight: type.displayWeight, fontSize: 22, color: p.ink, marginTop: 4, letterSpacing: '-0.01em', fontStyle: 'italic' }}>{t.editorialSub}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4, marginRight: -20 }}>
          {GUIDES.map((g, i) => (
            <button key={i} onClick={() => onOpenGuide(i)} style={{ minWidth: 220, flex: '0 0 auto', cursor: 'pointer', background: 'transparent', border: 0, padding: 0, textAlign: 'left', fontFamily: 'inherit' }}>
              <SalonPhoto mood={g.mood} h={132} style={{ borderRadius: 14 }} />
              <div style={{ fontFamily: type.body, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.14em', color: p.inkMuted, marginTop: 8 }}>{lang === 'en' ? g.kicker_en : g.kicker_es}</div>
              <div style={{ fontFamily: type.display, fontSize: 16, fontWeight: type.displayWeight, color: p.ink, marginTop: 4, lineHeight: 1.25 }}>{lang === 'en' ? g.t_en : g.t_es}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px 110px' }}>
        <Eyebrow c={p.inkMuted}>02 · {t.nearby.toUpperCase()}</Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BIDS.slice(0, 3).map(s => (
            <button key={s.id} onClick={() => onOpenSalon?.(s)} style={{
              display: 'flex', gap: 12, alignItems: 'center', background: p.surface, padding: 10,
              borderRadius: 14, border: `0.5px solid ${p.line}`, cursor: 'pointer', width: '100%',
              textAlign: 'left', fontFamily: 'inherit',
            }}>
              <SalonPhoto mood={s.mood} h={56} style={{ width: 56, borderRadius: 10 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: type.display, fontSize: 15, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.01em' }}>{s.name}</div>
                <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted, marginTop: 2, display: 'flex', gap: 6 }}>
                  <Stars n={s.rating} color={p.accent} size={10} />
                  <span>{s.rating}</span><span>·</span><span>{s.neighborhood}</span><span>·</span>
                  <span style={{ fontFamily: type.mono }}>{s.distance} {t.miAway}</span>
                </div>
                <div style={{ display: 'flex', gap: 3, marginTop: 5, flexWrap: 'wrap' }}>
                  {(s.badges || []).slice(0, 2).map(b => <TrustBadge key={b} kind={b} p={p} type={type} />)}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={p.inkMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
