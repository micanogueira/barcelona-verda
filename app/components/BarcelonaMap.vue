<template>
  <div ref="mapContainer" class="map-container" />
</template>

<script setup>
import maplibregl from 'maplibre-gl'

const props = defineProps({
  filter: { type: String, default: 'all' },
})

const mapContainer = ref(null)
const supabase = useSupabaseClient()
let map = null

const ICON_BY_TYPE = {
  park: '🌳',
  garden: '🌸',
  hort: '🥕',
  square: '⛲',
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

  if (error || !data) return

  data.forEach((space) => {
    const coords = parseLocation(space.location)
    if (!coords) return

    const el = document.createElement('div')
    el.className = 'map-marker'
    el.innerHTML = ICON_BY_TYPE[space.type] ?? '🌿'
    if (space.needs_help) el.classList.add('needs-help')

    new maplibregl.Marker({ element: el })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="popup-content">
            <strong>${space.name}</strong>
            <span class="popup-tag">${space.type}</span>
            ${space.description ? `<p>${space.description}</p>` : ''}
            ${space.neighborhood ? `<p class="popup-hood">📍 ${space.neighborhood}</p>` : ''}
            ${space.participant_count ? `<p class="popup-count">👥 ${space.participant_count} participants</p>` : ''}
          </div>
        `)
      )
      .addTo(map)
  })
}

function parseLocation(location) {
  if (!location) return null
  if (typeof location === 'object' && location.coordinates) {
    return location.coordinates
  }
  return null
}

onUnmounted(() => map?.remove())
</script>

<style>
.map-marker {
  font-size: 24px;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  transition: transform 0.15s;
}
.map-marker:hover { transform: scale(1.2); }
.map-marker.needs-help::after {
  content: '!';
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e53e3e;
  color: white;
  font-size: 10px;
  font-weight: 800;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content { font-family: 'Inter', sans-serif; min-width: 180px; }
.popup-content strong { display: block; font-size: 15px; color: #1b4332; margin-bottom: 4px; }
.popup-tag { display: inline-block; background: #d8f3dc; color: #2d6a4f; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; }
.popup-content p { font-size: 13px; color: #4a5568; margin: 4px 0; }
.popup-hood, .popup-count { color: #718096 !important; font-size: 12px !important; }
</style>

<style scoped>
.map-container { width: 100%; height: 100%; }
</style>
