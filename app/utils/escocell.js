// MOCK ONLY — until `trees.is_available` / `trees.padri_id` actually exist
// (see docs/notas-funcionalidades.md). Shared by the map and the list so both
// show the same escocell status from a single source of truth.

const MOCK_PADRI_NAMES = ['Laia', 'Jordi', 'Núria', 'Marc', 'Anna', 'Pere']

// Free-licence photo of escocells in Barcelona (Passeig de Gràcia), CC BY-SA 3.0
export const ESCOCELL_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Bancs-escocell_del_Passeig_de_Gràcia.jpg'

// Same official destination as the "Cuida l'escocell" card in participar.vue
export const ESCOCELL_URL = 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cuida-lescocell'

// Two fixed demo examples by name; everything else is generated deterministically
// from the id so the preview stays stable on reload.
const MOCK_OVERRIDES = {
  "Plàtan de Gràcia": { available: true },
  "Om de l'Eixample": {
    available: false,
    padriName: 'Laia',
    monthsAgo: 7,
    photoUrl: ESCOCELL_PHOTO,
    photoCredit: 'Pere López · CC BY-SA',
  },
}

export function mockEscocellStatus(tree) {
  if (tree.name && MOCK_OVERRIDES[tree.name]) return MOCK_OVERRIDES[tree.name]
  let hash = 0
  for (const c of String(tree.id)) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  if (hash % 100 < 25) return { available: true }
  return {
    available: false,
    padriName: MOCK_PADRI_NAMES[hash % MOCK_PADRI_NAMES.length],
    monthsAgo: 1 + (hash % 11),
  }
}
