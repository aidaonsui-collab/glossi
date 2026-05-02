import { useLang } from '../store.jsx';

// useT returns a translator that picks Spanish when the stored lang is 'es'.
// Usage: const t = useT(); t('Sign in', 'Iniciar sesión')
export function useT() {
  const { lang } = useLang();
  return (en, es) => (lang === 'es' && es != null ? es : en);
}
