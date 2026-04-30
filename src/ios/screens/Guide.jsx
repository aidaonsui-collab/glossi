import SalonPhoto from '../../components/SalonPhoto.jsx';
import { GUIDES } from '../data.js';

const BODIES = {
  0: {
    en: {
      dek: 'A vocabulary cheat-sheet for the chair: ombré, mechas, baby lights, and the words your Tía actually uses.',
      author: 'María Treviño', authorRole: 'Senior stylist · Pharr',
      sections: [
        { h: 'Why this matters', p: 'Half of bad color jobs in the Valley start with a translation gap. "Highlights" lands differently than "rayitos" — and "balayage" gets confused with "babylights" all the time. Use the real words, you spend less time fixing what you didn\'t order.' },
        { h: 'Five words to know', list: [['Mechas', 'Highlights, full panel. Bold contrast.'], ['Rayitos', 'Babylights. Soft, fine, sun-kissed.'], ['Iluminaciones', 'Face-frame highlights only.'], ['Decoloración', 'Bleach lift — ask about timing.'], ['Tonalizar', 'Toner. Kills brassiness.']] },
        { h: 'What to send', p: 'Two photos: hair right now in natural light, and the result you want. Add one sentence about what you DON\'T want — that line cuts re-do bookings in half.' },
        { pull: '"If she says \'pero suave\' — soft, but — believe her. That\'s the brief."' },
      ],
    },
    es: {
      dek: 'Vocabulario para la silla: ombré, mechas, baby lights, y las palabras que sí usa tu Tía.',
      author: 'María Treviño', authorRole: 'Estilista senior · Pharr',
      sections: [
        { h: 'Por qué importa', p: 'La mitad de los malos trabajos de color empiezan con un mal entendido. "Highlights" no es lo mismo que "rayitos". Usa las palabras correctas y pierdes menos tiempo arreglando lo que no pediste.' },
        { h: 'Cinco palabras', list: [['Mechas', 'Highlights de panel completo.'], ['Rayitos', 'Babylights. Finos, suaves.'], ['Iluminaciones', 'Solo en el marco de la cara.'], ['Decoloración', 'Decolorante.'], ['Tonalizar', 'Tonalizador. Mata el brassy.']] },
        { h: 'Qué mandar', p: 'Dos fotos: tu pelo ahora con luz natural, otra del resultado. Agrega qué NO quieres — reduce reagendamientos a la mitad.' },
        { pull: '"Si dice \'pero suave\' — créele. Ese es el brief."' },
      ],
    },
  },
  1: {
    en: {
      dek: 'Six standout neighborhood salons across the RGV — what they do best, who they\'re for.',
      author: 'The Glossi Editors', authorRole: 'McAllen, TX',
      sections: [
        { h: 'How we picked', p: 'We sent the same ask — color refresh, $120 budget, weekend slot — to 80 salons across the Valley. We watched response time, photo quality, and tone. These six rose to the top.' },
        { list: [['Casa de Belleza · Pharr', 'Old-school warmth, modern color. Marisol\'s 12 years show in the gloss.'], ['Studio Onyx · McAllen', 'Private chairs, premium product.'], ['La Reina · Edinburg', 'Newest on the list. Luz answers in two minutes flat.'], ['The Beauty Loft · Mission', 'Senior stylists, real loyalty perks.'], ['Brisa Hair Bar · Weslaco', 'Bilingual top to bottom. Free parking.'], ['Salón D\'Lara · Brownsville', 'New to Glossi but not new to the chair.']] },
      ],
    },
    es: {
      dek: 'Seis salones destacados del Valle — qué hacen mejor, y para quién.',
      author: 'Los editores de Glossi', authorRole: 'McAllen, TX',
      sections: [
        { h: 'Cómo elegimos', p: 'Mandamos la misma solicitud a 80 salones del Valle. Medimos tiempo, calidad de fotos, y trato. Estos seis ganaron.' },
        { list: [['Casa de Belleza · Pharr', 'Calor del barrio, color moderno.'], ['Studio Onyx · McAllen', 'Sillas privadas, producto premium.'], ['La Reina · Edinburg', 'Luz contesta en 2 minutos.'], ['The Beauty Loft · Mission', 'Estilistas senior, lealtad.'], ['Brisa Hair Bar · Weslaco', 'Bilingüe de pies a cabeza.'], ['Salón D\'Lara · Brownsville', 'Nueva en Glossi.']] },
      ],
    },
  },
  2: {
    en: {
      dek: 'Stop overpaying. Stop underpaying. Here\'s what the math actually looks like in 2026.',
      author: 'Glossi Pricing Desk', authorRole: 'Data from 2,400 RGV bookings',
      sections: [
        { h: 'The bands', p: 'After 2,400 bookings across the Valley, fair-price bands by service. Real numbers — middle 50% of last quarter.' },
        { table: [['Service', 'Fair', 'Premium'], ['Haircut & style', '$45–65', '$80+'], ['Color refresh', '$95–135', '$160+'], ['Full balayage', '$160–220', '$260+'], ['Gel manicure', '$30–45', '$55+'], ['Lash full set', '$110–145', '$180+']] },
        { h: 'When premium pays', p: 'Two cases: corrective color, and stylists with documented editorial work. Anything else, the middle band is your friend.' },
        { pull: '"Pay for the years in the chair, not the chandeliers in the lobby."' },
      ],
    },
    es: {
      dek: 'Deja de pagar de más. Cuentas reales en 2026.',
      author: 'Glossi · Precios', authorRole: 'Datos de 2,400 reservas',
      sections: [
        { h: 'Las bandas', p: '2,400 reservas en el Valle. El 50% del centro del trimestre pasado.' },
        { table: [['Servicio', 'Justo', 'Premium'], ['Corte y peinado', '$45–65', '$80+'], ['Color', '$95–135', '$160+'], ['Balayage', '$160–220', '$260+'], ['Gel mani', '$30–45', '$55+'], ['Set de pestañas', '$110–145', '$180+']] },
        { h: 'Cuándo sí premium', p: 'Color correctivo y trayectoria editorial. Lo demás, la banda del medio.' },
        { pull: '"Paga por los años en la silla, no por el candelabro."' },
      ],
    },
  },
};

export default function Guide({ p, type, lang, guideIndex = 0, onBack }) {
  const g = GUIDES[guideIndex];
  const body = (BODIES[guideIndex] || BODIES[0])[lang];
  return (
    <div style={{ background: p.bg, minHeight: '100%', paddingBottom: 40 }}>
      <SalonPhoto mood={g.mood} h={340} style={{ borderRadius: 0 }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: 54, left: 18, width: 36, height: 36, borderRadius: 999,
          border: 0, cursor: 'pointer', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', bottom: 22, left: 20, right: 20 }}>
          <div style={{ fontFamily: type.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,.85)' }}>{lang === 'en' ? g.kicker_en : g.kicker_es}</div>
          <div style={{ fontFamily: type.display, fontSize: 30, fontWeight: type.displayWeight, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 8, fontStyle: 'italic' }}>
            {lang === 'en' ? g.t_en : g.t_es}
          </div>
        </div>
      </SalonPhoto>

      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ fontFamily: type.display, fontSize: 17, fontWeight: type.displayWeight, color: p.ink, lineHeight: 1.35, letterSpacing: '-0.01em' }}>{body.dek}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 14, borderTop: `0.5px solid ${p.line}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: p.accentSoft, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: type.display, fontSize: 13, fontWeight: 700 }}>
            {body.author.split(' ').map(s => s[0]).slice(0, 2).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: type.body, fontSize: 12, color: p.ink, fontWeight: 600 }}>{body.author}</div>
            <div style={{ fontFamily: type.body, fontSize: 11, color: p.inkMuted }}>{body.authorRole}</div>
          </div>
        </div>

        {body.sections.map((s, i) => (
          <div key={i} style={{ marginTop: 24 }}>
            {s.h && <div style={{ fontFamily: type.display, fontSize: 22, fontWeight: type.displayWeight, color: p.ink, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8, fontStyle: 'italic' }}>{s.h}</div>}
            {s.p && <div style={{ fontFamily: type.body, fontSize: 14, color: p.inkSoft, lineHeight: 1.55 }}>{s.p}</div>}
            {s.list && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {s.list.map(([term, def], j) => (
                  <div key={j} style={{ paddingLeft: 14, borderLeft: `2px solid ${p.accent}` }}>
                    <div style={{ fontFamily: type.display, fontSize: 15, color: p.ink, fontWeight: 600, letterSpacing: '-0.01em' }}>{term}</div>
                    <div style={{ fontFamily: type.body, fontSize: 13, color: p.inkSoft, marginTop: 2, lineHeight: 1.45 }}>{def}</div>
                  </div>
                ))}
              </div>
            )}
            {s.table && (
              <div style={{ marginTop: 6, borderRadius: 12, overflow: 'hidden', border: `0.5px solid ${p.line}`, background: p.surface }}>
                {s.table.map((row, j) => (
                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8, padding: '10px 14px', borderTop: j ? `0.5px solid ${p.line}` : 'none', background: j === 0 ? p.surface2 : 'transparent' }}>
                    {row.map((cell, k) => (
                      <div key={k} style={{
                        fontFamily: j === 0 ? type.body : (k === 0 ? type.body : type.mono),
                        fontSize: j === 0 ? 10.5 : 12,
                        fontWeight: j === 0 ? 700 : (k === 0 ? 600 : 500),
                        letterSpacing: j === 0 ? '0.08em' : 0,
                        textTransform: j === 0 ? 'uppercase' : 'none',
                        color: j === 0 ? p.inkMuted : p.ink,
                        textAlign: k === 0 ? 'left' : 'right',
                      }}>{cell}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {s.pull && (
              <div style={{ marginTop: 10, padding: '18px 20px', borderRadius: 14, background: p.accentSoft, color: p.ink, fontFamily: type.display, fontSize: 18, lineHeight: 1.3, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{s.pull}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
