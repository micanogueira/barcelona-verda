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

const props = defineProps({
  filter: { type: String, default: 'all' },
})

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

const OFFICIAL_PROGRAM = {
  park:    { label: "Cogestió d'Espais Públics",  url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics' },
  garden:  { label: "Cogestió d'Espais Públics",  url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics' },
  hort:    { label: "Xarxa d'Horts Municipals",   url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals' },
  reserva: { label: "Cessió d'Espais Municipals", url: 'https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cessio-despais-municipals-dus-comunitari' },
  mediator: null,
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
  map.on('load', () => { loadGreenSpaces(); loadTrees() })
})

async function loadGreenSpaces() {
  const { data, error } = await supabase
    .from('green_spaces')
    .select('id, name, type, description, neighborhood, needs_help, participant_count, location')

  if (error || !data?.length) return

  data.forEach((space) => {
    const coords = parseLocation(space.location)
    if (!coords) return

    const iconName = ICON_BY_TYPE[space.type] ?? 'leaf'
    const color    = MARKER_COLOR[space.type] ?? '#52b788'
    const openCall    = mockAcceptingApplications(space)
    const cededTo     = mockCededTo(space)
    const cogestionat = mockCogestionat(space)

    const wrapper = document.createElement('div')
    wrapper.className = 'map-marker-wrapper'
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
              <div class="popup-help-title">${iconMarkup('lifebuoy', { size: 13 })} Cal ajuda en aquest espai</div>
              <p class="popup-help-text">Aquest espai necessita més veïns implicats per mantenir-se actiu i ben cuidat.</p>
            </div>
            <a href="/participar" class="popup-help-cta">Vull ajudar →</a>` : ''}
            <strong>${space.name}</strong>
            <span class="popup-tag popup-tag--${space.type}">${labelByType(space.type)}</span>
            ${space.description ? `<p>${space.description}</p>` : ''}
            ${space.neighborhood ? `<p class="popup-meta">${iconMarkup('pin', { size: 13 })} ${space.neighborhood}</p>` : ''}
            ${space.participant_count ? `<p class="popup-meta">${iconMarkup('users', { size: 13 })} ${space.participant_count} participants</p>` : ''}
            ${cededTo ? `
            <div class="popup-ceded-badge">
              <span class="popup-ceded-label">${iconMarkup('users', { size: 12 })} Gestionat per</span>
              <span class="popup-ceded-name">${cededTo}</span>
            </div>` : ''}
            ${cogestionat ? `
            <div class="popup-cogestio-badge">
              <span class="popup-cogestio-label">${iconMarkup('leaf', { size: 12 })} Cogestionat per</span>
              <span class="popup-cogestio-name">${cogestionat}</span>
            </div>` : ''}
            ${openCall ? `
            <div class="popup-opportunity-status popup-opportunity-open">
              ${iconMarkup('check', { size: 13 })} Convocatòria oberta
              <a href="${OFFICIAL_PROGRAM.hort.url}" target="_blank" rel="noopener" class="popup-opportunity-cta">Veure convocatòria →</a>
            </div>` : ''}
            ${OFFICIAL_PROGRAM[space.type] ? `
            <div class="popup-official">
              ${iconMarkup('info-circle', { size: 12 })}
              <span>Programa oficial:</span>
              ${openCall
                ? `<span>${OFFICIAL_PROGRAM[space.type].label}</span>`
                : `<a href="${OFFICIAL_PROGRAM[space.type].url}" target="_blank" rel="noopener">${OFFICIAL_PROGRAM[space.type].label} →</a>`}
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
    .select('id, name, species, location, health')

  if (error || !data?.length) return

  data.forEach((tree) => {
    const coords = parseLocation(tree.location)
    if (!coords) return

    const status = mockEscocellStatus(tree)

    const wrapper = document.createElement('div')
    wrapper.className = 'map-marker-wrapper'
    if (status.available) wrapper.classList.add('has-opportunity')

    const el = document.createElement('div')
    el.className = 'map-marker'
    el.style.background = MARKER_COLOR.tree
    el.innerHTML = iconMarkup('pine', { size: 17 })
    wrapper.appendChild(el)

    const statusHtml = status.available
      ? `<div class="popup-opportunity-status popup-opportunity-open">
           ${iconMarkup('check', { size: 13 })} Escocell disponible
           <a href="${ESCOCELL_URL}" target="_blank" rel="noopener" class="popup-opportunity-cta">Sol·licitar-lo →</a>
         </div>`
      : `<div class="popup-escocell-padri">
           ${status.photoUrl ? `<img class="popup-escocell-photo" src="${status.photoUrl}" alt="Escocell apadrinat" loading="lazy" />` : ''}
           <span class="popup-escocell-padri-line">
             ${iconMarkup('user', { size: 13 })} Apadrinat per ${status.padriName}, des de fa ${status.monthsAgo} ${status.monthsAgo === 1 ? 'mes' : 'mesos'}
           </span>
           ${status.photoCredit ? `<span class="popup-photo-credit">Foto: ${status.photoCredit}</span>` : ''}
         </div>`

    const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 20 }).setHTML(`
          <div class="popup-content">
            <strong>${tree.name ?? 'Escocell'}</strong>
            <span class="popup-tag popup-tag--tree">Escocell</span>
            ${tree.species ? `<p>${tree.species}</p>` : ''}
            ${tree.health ? `<p class="popup-meta">${iconMarkup('leaf', { size: 13 })} Estat: ${tree.health}</p>` : ''}
            ${statusHtml}
          </div>
        `)
      )
      .addTo(map)

    treeMarkers.push({ marker, id: tree.id })
  })
}

watch(() => props.filter, (val) => {
  spaceMarkers.forEach(({ marker, type, needsHelp }) => {
    const show = val === 'all' || type === val
      || (val === 'park' && type === 'garden') // "Parcs i jardins" also covers gardens
      || (val === 'help' && needsHelp)
    setVisible(marker, show)
  })
  treeMarkers.forEach(({ marker }) => {
    setVisible(marker, val === 'all' || val === 'tree')
  })
})

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

function labelByType(type) {
  return { park: 'Parc', garden: 'Jardí', hort: 'Hort urbà', mediator: "Punt d'informació", tree: 'Arbre', reserva: 'Reserva de biodiversitat' }[type] ?? type
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
