// Conjunto leve de ícones de linha (estilo outline, 24x24, stroke=currentColor),
// inspirado no Tabler Icons. Mantido localmente para não depender de um pacote
// npm com milhares de arquivos (tentamos @tabler/icons-vue e o install travou
// devido ao volume de arquivos na pasta sincronizada do projeto).
//
// Cada entrada é o conteúdo interno (<path>/<circle>...) de um <svg>.
export const ICON_PATHS = {
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V6l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
  map2: '<path d="M12 4 4 8l8 4 8-4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/>',
  trees: '<circle cx="8" cy="9" r="4"/><path d="M8 13v7"/><circle cx="16" cy="7" r="5"/><path d="M16 12v8"/>',
  pine: '<path d="M12 3l4 6h-2.5l3.5 6H7l3.5-6H8.5z"/><path d="M12 15v6"/>',
  carrot:
    '<path d="M3 21s9.834 -3.489 12.684 -6.34a4.487 4.487 0 0 0 0 -6.344a4.483 4.483 0 0 0 -6.342 0c-2.86 2.861 -6.347 12.689 -6.347 12.689l.005 -.005" /><path d="M9 13l-1.5 -1.5" /><path d="M16 14l-2 -2" /><path d="M22 8s-1.14 -2 -3 -2c-1.406 0 -3 2 -3 2s1.14 2 3 2s3 -2 3 -2" /><path d="M16 2s-2 1.14 -2 3s2 3 2 3s2 -1.577 2 -3c0 -1.86 -2 -3 -2 -3" />',
  link2: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  lifebuoy:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3v5.3"/><path d="M12 15.7V21"/><path d="M3 12h5.3"/><path d="M15.7 12H21"/>',
  flower:
    '<circle cx="12" cy="7.5" r="2.4"/><circle cx="12" cy="16.5" r="2.4"/><circle cx="7.5" cy="12" r="2.4"/><circle cx="16.5" cy="12" r="2.4"/><circle cx="12" cy="12" r="2"/>',
  droplet: '<path d="M12 3c3 4 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-7 6-11z"/>',
  pin: '<path d="M12 21s7-7.4 7-12a7 7 0 1 0-14 0c0 4.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.2"/><path d="M16 14.3c2.2.5 4 2.6 4 5.7"/>',
  leaf: '<path d="M12 21c-4.2-.8-8-4.7-8-11A8 8 0 0 1 12 2c5 0 9 4 9 9 0 6.2-5 9-9 10z"/><path d="M8 14c1.8-3.8 4.8-6.8 9-8.6"/>',
  'clipboard-list':
    '<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 12l.01 0" /><path d="M13 12l2 0" /><path d="M9 16l.01 0" /><path d="M13 16l2 0" />',
  confetti:
    '<path d="M4 5h2" /><path d="M5 4v2" /><path d="M11.5 4l-.5 2" /><path d="M18 5h2" /><path d="M19 4v2" /><path d="M15 9l-1 1" /><path d="M18 13l2 -.5" /><path d="M18 19h2" /><path d="M19 18v2" /><path d="M14 16.518l-6.518 -6.518l-4.39 9.58a1 1 0 0 0 1.329 1.329l9.579 -4.39" />',
  'chevron-left': '<path d="M15 6l-6 6l6 6" />',
}

// Gera o markup completo de um <svg> em string — usado fora do Vue (ex.
// marcadores do MapLibre, que são elementos DOM criados imperativamente).
export function iconMarkup(name, { size = 20, strokeWidth = 2 } = {}) {
  const inner = ICON_PATHS[name] ?? ICON_PATHS.leaf
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
}
