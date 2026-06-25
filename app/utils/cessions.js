// MOCK ONLY — until `green_spaces` has a real way to represent municipal
// cessions to nonprofit entities (see docs/notas-funcionalidades.md).
//
// The real "Cessió d'Espais Municipals" program cedes unused plots to
// non-profit entities to become one of three outcomes: horts, jardins
// comunitaris, or reserves de biodiversitat. Scoped here to the matching
// types: `garden` (jardí comunitari), `hort`, and `reserva`. A space type
// belonging to more than one program is fine, so no type is excluded.

const CEDED_TYPES = ['garden', 'hort', 'reserva']

const MOCK_ENTITIES = ['Fundació Verda Tibidabo', 'Associació de Veïns del Turó', 'Cooperativa El Brot']

// Fixed demo examples by name — ids are auto-generated UUIDs on every reseed.
const MOCK_OVERRIDES = {
  'Jardins de la Tamarita': 'Fundació Verda Tibidabo',
  'Reserva de Biodiversitat de Vallcarca': 'Cooperativa El Brot',
}

export function mockCededTo(space) {
  if (!CEDED_TYPES.includes(space.type)) return null
  if (space.name && space.name in MOCK_OVERRIDES) return MOCK_OVERRIDES[space.name]
  let hash = 0
  for (const c of String(space.id)) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  if (hash % 100 < 35) return MOCK_ENTITIES[hash % MOCK_ENTITIES.length]
  return null
}
