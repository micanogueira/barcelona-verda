// MOCK ONLY — until `green_spaces` has a real field for application windows
// (see docs/notas-funcionalidades.md). Shared by the map and the list so both
// show the same "convocatòria oberta" status from a single source of truth.

// Fixed demo example by name — ids are auto-generated UUIDs on every reseed,
// so a hash-only approach can't guarantee a visible example. Everything else
// is generated deterministically from the id so the preview stays stable on reload.
// Picked deliberately on a hort that does NOT also have needs_help = true,
// so the demo doesn't show two competing banners ("Cal ajuda" + "Convocatòria
// oberta") on the same card.
const MOCK_OVERRIDES = {
  "Hort de l'Eixample": true,
}

export function mockAcceptingApplications(space) {
  if (space.type !== 'hort') return false
  if (space.name && space.name in MOCK_OVERRIDES) return MOCK_OVERRIDES[space.name]
  let hash = 0
  for (const c of String(space.id)) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  return hash % 100 < 30 // ~30% of horts have an open call, for preview only
}
