<template>
  <div ref="mapContainer" class="map-container" />
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import { iconMarkup } from '~/utils/icons'

const props = defineProps({
  filter: { type: String, default: 'all' },
})

const mapContainer = ref(null)
const supabase = useSupabaseClient()
let map = null
const markers = [] // { marker, type }

const ICON_BY_TYPE = {
  park:     'trees',
  garden:   'flower',
  hort:     'carrot',
  square:   'droplet',
  mediator: 'info-circle',
}

const MARKER_COLOR = {
  park:     '#2d6a4f',
  garden:   '#c75c9e',
  hort:     '#e08e29',
  square:   '#3a86c8',
  mediator: '#6366f1',
}

onMounted(async () => {
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
  map.on('load', () => loadGreenSpaces())
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
    const color = MARKER_COLOR[space.type] ?? '#52b788'

    const el = document.createElement('div')
    el.className = 'map-marker'
    el.style.background = color
    el.innerHTML = iconMarkup(iconName, { size: 17 })
    if (space.needs_help) el.classList.add('needs-help')

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="popup-content">
            <strong>${space.name}</strong>
            <span class="popup-tag popup-tag--${space.type}">${labelByType(space.type)}</span>
            ${space.description ? `<p>${space.description}</p>` : ''}
            ${space.neighborhood ? `<p class="popup-meta">${iconMarkup('pin', { size: 13 })} ${space.neighborhood}</p>` : ''}
            ${space.participant_count ? `<p class="popup-meta">${iconMarkup('users', { size: 13 })} ${space.participant_count} participants</p>` : ''}
          </div>
        `)
      )
      .addTo(map)

    markers.push({ marker, type: space.type })
  })
}

// Apply filter: show only matching markers
watch(() => props.filter, (val) => {
  markers.forEach(({ marker, type }) => {
    const visible = val === 'all' || type === val
    marker.getElement().style.display = visible ? 'block' : 'none'
  })
})

function labelByType(type) {
  return { park: 'Parc', garden: 'Jardí', hort: 'Hort urbà', square: 'Plaça', mediator: "Punt d'informació" }[type] ?? type
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
.map-marker {
  position: relative;
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
.map-marker.needs-help::after {
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

.popup-content { font-family: 'Inter', sans-serif; min-width: 190px; }
.popup-content strong { display: block; font-size: 15px; color: #1b4332; margin-bottom: 6px; }
.popup-tag {
  display: inline-block;
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;
  background: #d8f3dc; color: #2d6a4f;
}
.popup-tag--garden   { background: #fce4f6; color: #9c2f7f; }
.popup-tag--hort     { background: #fef3e2; color: #9a5e0a; }
.popup-tag--square   { background: #dbeafe; color: #1d4ed8; }
.popup-tag--mediator { background: #ede9fe; color: #4f46e5; }
.popup-content p { font-size: 13px; color: #4a5568; margin: 4px 0; }
.popup-meta { display: flex; align-items: center; gap: 4px; color: #718096 !important; font-size: 12px !important; }
</style>

<style scoped>
.map-container { width: 100%; height: 100%; }
</style>
