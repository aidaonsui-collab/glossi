import { useLang } from '../store.jsx';

// useT returns a translator that picks Spanish when the stored lang is 'es'.
// Usage: const t = useT(); t('Sign in', 'Iniciar sesión')
export function useT() {
  const { lang } = useLang();
  return (en, es) => (lang === 'es' && es != null ? es : en);
}

// Service slugs are stored as-is in the DB ('color', 'haircut', 'lashes-brows'…)
// and rendered across customer + salon pages. Map them to human labels in both
// languages so callers don't have to re-do the slug→label dance per page.
const SLUG_LABELS = {
  haircut:        { en: 'Haircut',        es: 'Corte de cabello' },
  hairstyle:      { en: 'Hairstyle',      es: 'Peinado' },
  color:          { en: 'Color',          es: 'Color' },
  nails:          { en: 'Nails',          es: 'Uñas' },
  'lashes-brows': { en: 'Lashes & brows', es: 'Pestañas y cejas' },
  'hair-removal': { en: 'Hair removal',   es: 'Depilación' },
  facials:        { en: 'Facials',        es: 'Faciales' },
  massage:        { en: 'Massage',        es: 'Masaje' },
  'med-spa':      { en: 'Med spa',        es: 'Med spa' },
  makeup:         { en: 'Makeup',         es: 'Maquillaje' },
  tanning:        { en: 'Tanning',        es: 'Bronceado' },
};

export function slugLabel(slug, lang) {
  const lab = SLUG_LABELS[slug];
  if (lab) return lang === 'es' ? lab.es : lab.en;
  return (slug || '').replace(/-/g, ' & ');
}

export function fmtSlugs(slugs, lang) {
  return (slugs || []).map(s => slugLabel(s, lang)).join(', ');
}

export function useFmtSlugs() {
  const { lang } = useLang();
  return slugs => fmtSlugs(slugs, lang);
}
