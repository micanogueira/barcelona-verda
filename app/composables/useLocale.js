import { translations } from '~/utils/translations'

// Lightweight CA/EN toggle backed by a shared useState. Catalan is the default
// (the real audience is Barcelona); English is for presenting to a non-Catalan
// audience. Persistence is restored client-side by plugins/locale.client.js so
// SSR always renders the default and no hydration mismatch occurs.
const DEFAULT_LOCALE = 'ca'
const SUPPORTED = ['ca', 'es', 'en']

function lookup(dict, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict)
}

export function useLocale() {
  const locale = useState('locale', () => DEFAULT_LOCALE)

  function setLocale(l) {
    if (!SUPPORTED.includes(l)) return
    locale.value = l
    if (import.meta.client) {
      try { localStorage.setItem('bv-locale', l) } catch {}
    }
  }

  // t('a.b.c', { name: 'Laia' }) — falls back to Catalan, then to the raw key.
  function t(key, params) {
    let str = lookup(translations[locale.value], key)
    if (str == null) str = lookup(translations[DEFAULT_LOCALE], key)
    if (str == null) return key
    if (params) {
      str = String(str).replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? params[k] : `{${k}}`))
    }
    return str
  }

  return { locale, setLocale, t }
}
