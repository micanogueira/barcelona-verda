<template>
  <div ref="mapContainer" class="map-container" />
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { iconMarkup } from '~/utils/icons'
import { mockEscocellStatus, ESCOCELL_URL } from '~/utils/escocell'
import { mockAcceptingApplications } from '~/utils/horts'
import { mockCededTo } from '~/utils/cessions'
import { mockCogestionat } from '~/utils/cogestio'
import { translateDescription } from '~/utils/descriptions'

const props = defineProps({
  filter: { type: String, default: 'all' },
})

const { t, locale } = useLocale()

const mapContainer = ref(null)
const supabase = useSupabaseClient()
let map = null
const spaceMarkers = [] // { marker, id, type, needsHelp }
const treeMarkers  = [] // { marker, id }

const ICON_BY_TYPE = {
  park:     'trees',
  garden:   'flower',
  hort:     'carrot',
  mediator: 'info-circle',
  reserva:  'seedling',
}

const MARKER_COLOR = {
  park:     '#2d6a4f',
  garden:   '#c75c9e',
  hort:     '#e08e29',
  mediator: '#6366f1',
  tree:     '#52b788',
  reserva:  '#0d9488',
}

const PROGRAM = {
  horts:    { label: "Xarxa d'Horts Municipals",   url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals' },
  cessio:   { label: "Cessió d'Espais Municipals", url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cessio-despais-municipals-dus-comunitari' },
  cogestio: { label: "Cogestió d'Espais Públics",  url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics' },
}

// Intrinsic official program per type. `garden` is omitted on purpose: a garden
// can belong to Cessió, Cogestió, or both at once, so its footer is derived from
// the badges actually present (see officialProgramsFor).
const PROGRAM_BY_TYPE = {
  hort:    PROGRAM.horts,
  reserva: PROGRAM.cessio,
  park:    PROGRAM.cogestio,
}

// Official program(s) shown in the popup footer, kept aligned with the badges.
function officialProgramsFor(space, { cededTo, cogestionat }) {
  if (space.type === 'garden') {
    // A plain garden in neither program shows no official-program footer
    const progs = []
    if (cededTo)     progs.push(PROGRAM.cessio)
    if (cogestionat) progs.push(PROGRAM.cogestio)
    return progs
  }
  return PROGRAM_BY_TYPE[space.type] ? [PROGRAM_BY_TYPE[space.type]] : []
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        },
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
    },
    center: [2.1734, 41.3851],
    zoom: 13,
    minZoom: 11,
    maxZoom: 18,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')
  map.on('load', renderMarkers)
})

// Popups are built as HTML strings at render time, so switching language means
// tearing down the markers and rebuilding them with the new translations.
function clearMarkers() {
  spaceMarkers.forEach(({ marker }) => marker.remove())
  treeMarkers.forEach(({ marker }) => marker.remove())
  spaceMarkers.length = 0
  treeMarkers.length = 0
}

async function renderMarkers() {
  clearMarkers()
  await Promise.all([loadGreenSpaces(), loadTrees()])
  applyFilter(props.filter)
}

watch(locale, () => { if (map) renderMarkers() })

async function loadGreenSpaces() {
  const { data, error } = await supabase
    .from('green_spaces')
    .select('id, name, type, description, neighborhood, needs_help, participant_count, location, source, subtype')

  if (error || !data?.length) return

  data.forEach((space) => {
    const coords = parseLocation(space.location)
    if (!coords) return

    const iconName = ICON_BY_TYPE[space.type] ?? 'leaf'
    const color    = MARKER_COLOR[space.type] ?? '#52b788'
    // Demo-only statuses (open call, ceded/co-managed entities) apply only to our
    // curated example rows — never to imported real data.
    const isExample   = space.source === 'example'
    const openCall    = isExample && mockAcceptingApplications(space)
    const cededTo     = isExample ? mockCededTo(space) : null
    const cogestionat = isExample ? mockCogestionat(space) : null
    // Official-program footer. For curated demos it's the type-based assumption.
    // For imported real data we only claim a program when the source vouches for
    // it: municipal horts (ORIGEN → subtype 'municipal') belong to the XHM.
    const programs    = isExample
      ? officialProgramsFor(space, { cededTo, cogestionat })
      : (space.subtype === 'municipal' ? [PROGRAM.horts] : [])

    const wrapper = document.createElement('div')
    wrapper.className = 'map-marker-wrapper'
    if (isExample) wrapper.classList.add('is-example')
    if (space.needs_help) wrapper.classList.add('needs-help')
    if (openCall) wrapper.classList.add('has-opportunity')

    const el = document.createElement('div')
    el.className = 'map-marker'
    el.style.background = color
    el.innerHTML = iconMarkup(iconName, { size: 17 })
    wrapper.appendChild(el)

    const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 20 }).setHTML(`
          <div class="popup-content">
            ${space.needs_help ? `
            <div class="popup-help-banner">
              <div class="popup-help-title">${iconMarkup('lifebuoy', { size: 13 })} ${t('popup.needsHelpTitle')}</div>
              <p class="popup-help-text">${t('popup.needsHelpText')}</p>
            </div>
            <a href="/participar" class="popup-help-cta">${t('popup.helpCta')}</a>` : ''}
            <strong>${space.name}</strong>
            <span class="popup-tag popup-tag--${space.type}">${labelForSpace(space)}</span>
            ${isExample ? `<span class="popup-example-badge">${t('common.example')}</span>` : ''}
            ${space.description ? `<p>${translateDescription(space.description, locale.value)}</p>` : ''}
            ${space.neighborhood ? `<p class="popup-meta">${iconMarkup('pin', { size: 13 })} ${space.neighborhood}</p>` : ''}
            ${space.participant_count ? `<p class="popup-meta">${iconMarkup('users', { size: 13 })} ${space.participant_count} ${t('common.participants')}</p>` : ''}
            ${cededTo ? `
            <div class="popup-ceded-badge">
              <span class="popup-ceded-label">${iconMarkup('users', { size: 12 })} ${t('cession.managedByLabel')}</span>
              <span class="popup-ceded-name">${cededTo}</span>
            </div>` : ''}
            ${cogestionat ? `
            <div class="popup-cogestio-badge">
              <span class="popup-cogestio-label">${iconMarkup('leaf', { size: 12 })} ${t('cogestio.comanagedByLabel')}</span>
              <span class="popup-cogestio-name">${cogestionat}</span>
            </div>` : ''}
            ${openCall ? `
            <div class="popup-opportunity-status popup-opportunity-open">
              ${iconMarkup('check', { size: 13 })} ${t('status.openCall')}
              <a href="${PROGRAM.horts.url}" target="_blank" rel="noopener" class="popup-opportunity-cta">${t('popup.viewCall')}</a>
            </div>` : ''}
            ${programs.length ? `
            <div class="popup-official">
              ${iconMarkup('info-circle', { size: 12 })}
              <span>${t('popup.officialProgram')}</span>
              ${programs.map(p => (openCall && p === PROGRAM.horts)
                ? `<span>${p.label}</span>`
                : `<a href="${p.url}" target="_blank" rel="noopener">${p.label} →</a>`).join(' · ')}
            </div>` : ''}
          </div>
        `)
      )
      .addTo(map)

    spaceMarkers.push({ marker, id: space.id, type: space.type, needsHelp: !!space.needs_help })
  })
}

async function loadTrees() {
  const { data, error } = await supabase
    .from('trees')
    .select('id, name, species, location, health, source')

  if (error || !data?.length) return

  data.forEach((tree) => {
    const coords = parseLocation(tree.location)
    if (!coords) return

    const isExample = tree.source === 'example'
    const status = isExample ? mockEscocellStatus(tree) : { available: false }

    const wrapper = document.createElement('div')
    wrapper.className = 'map-marker-wrapper'
    if (isExample) wrapper.classList.add('is-example')
    if (status.available) wrapper.classList.add('has-opportunity')

    const el = document.createElement('div')
    el.className = 'map-marker'
    el.style.background = MARKER_COLOR.tree
    el.innerHTML = iconMarkup('pine', { size: 17 })
    wrapper.appendChild(el)

    const statusHtml = !isExample
      ? ''
      : status.available
      ? `<div class="popup-opportunity-status popup-opportunity-open">
           ${iconMarkup('check', { size: 13 })} ${t('popup.escocellAvailable')}
           <a href="${ESCOCELL_URL}" target="_blank" rel="noopener" class="popup-opportunity-cta">${t('popup.requestIt')}</a>
         </div>`
      : `<div class="popup-escocell-padri">
           ${status.photoUrl ? `<img class="popup-escocell-photo" src="${status.photoUrl}" alt="${t('popup.escocellAlt')}" loading="lazy" />` : ''}
           <span class="popup-escocell-padri-line">
             ${iconMarkup('user', { size: 13 })} ${t('popup.sponsoredSince', { name: status.padriName, n: status.monthsAgo, unit: status.monthsAgo === 1 ? t('common.month') : t('common.months') })}
           </span>
           ${status.photoCredit ? `<span class="popup-photo-credit">${t('popup.photo', { credit: status.photoCredit })}</span>` : ''}
         </div>`

    const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 20 }).setHTML(`
          <div class="popup-content">
            <strong>${tree.name ?? t('types.tree')}</strong>
            <span class="popup-tag popup-tag--tree">${t('types.tree')}</span>
            ${isExample ? `<span class="popup-example-badge">${t('common.example')}</span>` : ''}
            ${tree.species ? `<p>${tree.species}</p>` : ''}
            ${tree.health ? `<p class="popup-meta">${iconMarkup('leaf', { size: 13 })} ${t('popup.health', { health: tree.health })}</p>` : ''}
            ${statusHtml}
          </div>
        `)
      )
      .addTo(map)

    treeMarkers.push({ marker, id: tree.id })
  })
}

function applyFilter(val) {
  spaceMarkers.forEach(({ marker, type, needsHelp }) => {
    const show = val === 'all' || type === val
      || (val === 'park' && type === 'garden') // "Parcs i jardins" also covers gardens
      || (val === 'help' && needsHelp)
    setVisible(marker, show)
  })
  treeMarkers.forEach(({ marker }) => {
    setVisible(marker, val === 'all' || val === 'tree')
  })
}

watch(() => props.filter, applyFilter)

// Called by the list view: centers the map on the space/escocell and opens its popup
function focusSpace(id) {
  if (!map) return
  const entry = spaceMarkers.find(m => m.id === id) || treeMarkers.find(m => m.id === id)
  if (!entry) return
  map.flyTo({ center: entry.marker.getLngLat(), zoom: 16, duration: 800 })
  if (!entry.marker.getPopup()?.isOpen()) entry.marker.togglePopup()
}

defineExpose({ focusSpace })

function setVisible(marker, visible) {
  const el = marker.getElement()
  el.style.visibility = visible ? 'visible' : 'hidden'
  el.style.pointerEvents = visible ? 'auto' : 'none'
}

function labelForSpace(space) {
  // Horts carry a real subtype (municipal / comunitari / social) → refined label.
  if (space.type === 'hort' && space.subtype) return t(`hortSubtype.${space.subtype}`)
  return ['park', 'garden', 'hort', 'mediator', 'tree', 'reserva'].includes(space.type) ? t(`types.${space.type}`) : space.type
}

function parseLocation(location) {
  if (!location) return null
  if (typeof location === 'object' && location.coordinates) return location.coordinates
  if (typeof location !== 'string') return null
  if (location.startsWith('{')) {
    try { const g = JSON.parse(location); return g.coordinates ?? null } catch {}
  }
  try {
    const bytes = location.match(/.{2}/g).map(h => parseInt(h, 16))
    const view = new DataView(new Uint8Array(bytes).buffer)
    const le = bytes[0] === 1
    const type = view.getUint32(1, le)
    const hasSRID = (type & 0x20000000) !== 0
    const offset = hasSRID ? 9 : 5
    return [view.getFloat64(offset, le), view.getFloat64(offset + 8, le)]
  } catch {}
  return null
}

onUnmounted(() => map?.remove())
</script>

<style>
/* Wrapper: MapLibre positions this element via transform from the map's
   top-left corner — it MUST stay position:absolute (the .maplibregl-marker
   default). Overriding it with position:relative breaks the origin and makes
   markers drift together on zoom. NO transition here either. */
.map-marker-wrapper {
  position: absolute;
  width: 32px;
  height: 32px;
}

/* Visual circle: safe to animate since MapLibre never touches this element */
.map-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  transition: transform 0.15s;
}
.map-marker:hover { transform: scale(1.15); }
/* Curated example rows get a dark outline so they read as demos, distinct from
   the white outline of imported real data (and from the red "needs help" badge). */
.map-marker-wrapper.is-example .map-marker {
  border-color: #1a202c;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.85), 0 2px 6px rgba(0,0,0,0.3);
}
.map-marker-wrapper.needs-help::after {
  content: '!';
  position: absolute;
  top: -4px; right: -4px;
  background: #e53e3e;
  color: white;
  font-size: 10px;
  font-weight: 800;
  width: 14px; height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #fff;
}
.map-marker-wrapper.has-opportunity::after {
  content: '';
  position: absolute;
  top: -3px; right: -3px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #facc15;
  border: 1.5px solid #fff;
}

.popup-content { font-family: 'Inter', sans-serif; min-width: 190px; }
.popup-help-banner {
  background: #fff5f5;
  padding: 7px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  border: 1px solid #fed7d7;
}
.popup-help-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c53030;
  font-size: 12px;
  font-weight: 700;
}
.popup-help-text {
  font-size: 12px;
  font-weight: 400;
  color: #9b2c2c;
  line-height: 1.5;
  margin: 4px 0 0;
}
.popup-help-cta {
  display: block;
  margin: 0 0 12px;
  background: #e53e3e;
  color: white;
  text-align: center;
  padding: 8px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.popup-help-cta:hover { background: #c53030; }
.popup-ceded-badge {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px 5px;
  background: #f0faf4;
  color: #4a7c59;
  font-size: 11px;
  font-weight: 400;
  padding: 5px 9px;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #d6f0e0;
}
.popup-ceded-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  white-space: nowrap;
}
.popup-ceded-badge .popup-ceded-name { font-size: 11px; font-weight: 600; }
.popup-cogestio-badge {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px 5px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 400;
  padding: 5px 9px;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #dbe3fc;
}
.popup-cogestio-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  white-space: nowrap;
}
.popup-cogestio-badge .popup-cogestio-name { font-size: 11px; font-weight: 600; }
.popup-official {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e8f0e8;
  font-size: 12px;
  color: #718096;
}
.popup-official span { font-weight: 600; color: #4a5568; }
.popup-official a { color: #1d4ed8; text-decoration: none; font-weight: 600; }
.popup-official a:hover { text-decoration: underline; }
.popup-content strong { display: block; font-size: 15px; color: #1b4332; margin-bottom: 6px; }
.popup-tag {
  display: inline-block;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;
  background: #d8f3dc; color: #2d6a4f;
}
.popup-tag--garden   { background: #fce4f6; color: #9c2f7f; }
.popup-tag--hort     { background: #fef3e2; color: #9a5e0a; }
.popup-tag--mediator { background: #ede9fe; color: #4f46e5; }
.popup-tag--tree     { background: #d8f3dc; color: #1b4332; }
.popup-tag--reserva  { background: #ccfbf1; color: #0f766e; }
.popup-example-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 4px;
  margin: 0 0 8px 6px;
  background: #1a202c;
  color: #fff;
  vertical-align: middle;
}
.popup-content p { font-size: 13px; color: #4a5568; margin: 4px 0; }
.popup-meta { display: flex; align-items: center; gap: 4px; color: #718096 !important; font-size: 12px !important; }
.popup-opportunity-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e8f0e8;
  font-size: 12px;
}
.popup-opportunity-open { color: #92740a; }
.popup-opportunity-cta {
  color: #1d4ed8;
  text-decoration: none;
  font-weight: 700;
}
.popup-opportunity-cta:hover { text-decoration: underline; }

/* Apadrinat (community layer): optional photo + "des de quan" + photo credit */
.popup-escocell-padri {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e8f0e8;
}
.popup-escocell-padri-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #718096;
}
.popup-escocell-photo {
  display: block;
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}
.popup-photo-credit { font-size: 10px; color: #a0aec0; }
</style>

<style scoped>
.map-container { width: 100%; height: 100%; }
</style>
