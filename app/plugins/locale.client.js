// Restore the saved locale after hydration. Doing it on app:mounted (not during
// setup) keeps the server-rendered default and avoids a hydration mismatch; a
// returning English visitor sees a brief flash from Catalan, which is fine here.
export default defineNuxtPlugin((nuxtApp) => {
  const locale = useState('locale', () => 'ca')
  nuxtApp.hook('app:mounted', () => {
    try {
      const saved = localStorage.getItem('bv-locale')
      if (saved === 'ca' || saved === 'es' || saved === 'en') locale.value = saved
    } catch {}
  })
})
