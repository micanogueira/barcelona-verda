// MOCK ONLY — until `green_spaces` has a real way to represent co-management
// agreements with nonprofit entities (see docs/notas-funcionalidades.md).
//
// The real "Cogestió d'Espais Públics" program is about an entity helping to
// maintain a PART of an already-existing park — parterres, jardineres or
// basses naturalitzades — not the whole green space. We don't have schema
// granularity for sub-features, so this mock simplifies to the whole `park`
// row, same simplification already accepted for Cessió (see cessions.js).
// Scoped to `park` only: that's where these sub-features actually live.

const COGESTIO_TYPES = ['park']

const MOCK_ENTITIES = ['Associació de Veïns de la Guineueta', 'Taller Ocupacional Can Tomàtic', 'Colla de la Flor de Maig']

// Fixed demo example by name — picked on a park without needs_help, so the
// demo doesn't stack two banners on the same card (ids are auto-generated
// UUIDs on every reseed, so we key by name instead).
const MOCK_OVERRIDES = {
  'Parc de la Guineueta': 'Associació de Veïns de la Guineueta',
}

export function mockCogestionat(space) {
  if (!COGESTIO_TYPES.includes(space.type)) return null
  if (space.name && space.name in MOCK_OVERRIDES) return MOCK_OVERRIDES[space.name]
  let hash = 0
  for (const c of String(space.id)) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  if (hash % 100 < 30) return MOCK_ENTITIES[hash % MOCK_ENTITIES.length]
  return null
}
