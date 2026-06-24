<template>
  <main>
    <!-- Hero: Map Section -->
    <section class="hero">
      <NavBar :stats="stats" floating />

      <div class="map-wrapper">
        <ClientOnly>
          <BarcelonaMap ref="mapRef" :filter="activeFilter" />
          <template #fallback>
            <div class="map-placeholder">Carregant mapa...</div>
          </template>
        </ClientOnly>

        <!-- List view overlay -->
        <div v-if="viewMode === 'list'" class="list-overlay">
          <div v-if="loadingSpaces" class="list-loading">Carregant espais...</div>
          <div v-else class="list-items">
            <div v-if="filteredSpaces.length === 0" class="list-empty">
              Cap espai trobat per a aquest filtre.
            </div>
            <div
              v-for="space in filteredSpaces"
              :key="space.id"
              class="list-item"
              role="button"
              tabindex="0"
              :style="{ '--accent': colorByType[space.type] ?? '#52b788' }"
              @click="focusOnMap(space)"
              @keydown.enter="focusOnMap(space)"
            >
              <div class="list-item-icon" :style="{ background: colorByType[space.type] }">
                <AppIcon :name="iconByType[space.type] ?? 'leaf'" :size="18" />
              </div>
              <div class="list-item-body">
                <strong>{{ space.name }}</strong>
                <span class="list-item-tag">{{ labelByType(space.type) }}</span>
                <p v-if="space.neighborhood" class="list-item-meta"><AppIcon name="pin" :size="13" />{{ space.neighborhood }}</p>
                <p v-if="space.description" class="list-item-desc">{{ space.description }}</p>
                <p v-if="space.participant_count" class="list-item-meta"><AppIcon name="users" :size="13" />{{ space.participant_count }} participants</p>
                <p v-if="space.escocell && !space.escocell.available" class="list-item-meta"><AppIcon name="user" :size="13" />Apadrinat per {{ space.escocell.padriName }}</p>
              </div>
              <div class="list-item-right">
                <span v-if="space.needs_help" class="list-item-help">Cal ajuda</span>
                <span v-else-if="space.escocell?.available" class="list-item-available">Disponible</span>
                <span v-else-if="space.acceptingApplications" class="list-item-available">Convocatòria oberta</span>
                <AppIcon name="chevron-left" :size="18" class="list-item-go" />
              </div>
            </div>
          </div>
        </div>

        <!-- View toggle (map / list) -->
        <div class="view-toggle">
          <button :class="['view-btn', { active: viewMode === 'map' }]" @click="viewMode = 'map'">
            <AppIcon name="map" :size="15" /> Mapa
          </button>
          <button :class="['view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
            <AppIcon name="clipboard-list" :size="15" /> Llista
          </button>
        </div>

        <!-- Hero welcome overlay -->
        <div v-if="welcomeVisible && viewMode !== 'list'" class="hero-overlay">
          <button class="hero-close" @click="welcomeVisible = false" aria-label="Tancar">×</button>
          <div class="hero-badge">
            <AppIcon name="leaf" :size="13" /> Barcelona Verd
          </div>
          <h1 class="hero-title">La porta d'entrada als espais verds de Barcelona</h1>
          <p class="hero-desc">Descobreix parcs, horts, jardins i programes oficials: tot en un sol mapa interactiu.</p>
        </div>

        <!-- Filter panel (left side) -->
        <div :class="['filter-panel', { collapsed: !panelOpen }]">
          <button class="panel-toggle" @click="panelOpen = !panelOpen">
            <AppIcon name="map2" :size="16" class="filter-icon" />
            <span v-if="panelOpen" class="toggle-label">Espais verds</span>
            <AppIcon
              name="chevron-left"
              :size="14"
              class="toggle-arrow"
              :style="{ transform: panelOpen ? 'none' : 'rotate(180deg)' }"
            />
          </button>

          <template v-if="panelOpen">
            <div class="filter-divider" />
            <button
              v-for="f in filters"
              :key="f.value"
              :class="['filter-btn', { active: activeFilter === f.value }, f.value === 'help' ? 'help-filter' : '']"
              @click="activeFilter = f.value"
            >
              <AppIcon :name="f.icon" :size="15" class="filter-icon" />
              {{ f.label }}
            </button>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { mockEscocellStatus } from '~/utils/escocell'
import { mockAcceptingApplications } from '~/utils/horts'

const supabase = useSupabaseClient()

const activeFilter = ref('all')
const panelOpen = ref(true)
const viewMode = ref('map')
const welcomeVisible = ref(true)

// Auto-dismiss the welcome overlay after a few seconds
onMounted(() => {
  const timer = setTimeout(() => { welcomeVisible.value = false }, 6000)
  onUnmounted(() => clearTimeout(timer))
})

const iconByType = { park: 'trees', garden: 'flower', hort: 'carrot', mediator: 'info-circle', tree: 'pine' }
const colorByType = { park: '#2d6a4f', garden: '#c75c9e', hort: '#e08e29', mediator: '#6366f1', tree: '#52b788' }
function labelByType(type) {
  return { park: 'Parc', garden: 'Jardí', hort: 'Hort urbà', mediator: "Punt d'informació", tree: 'Escocell' }[type] ?? type
}

const mapRef = ref(null)
// Clicking a list card returns to the map, centered on that space
function focusOnMap(space) {
  viewMode.value = 'map'
  mapRef.value?.focusSpace?.(space.id)
}

const spaces = ref([])
const loadingSpaces = ref(false)
const filteredSpaces = computed(() => {
  if (activeFilter.value === 'all') return spaces.value
  if (activeFilter.value === 'help') return spaces.value.filter(s => s.needs_help)
  // "Parcs i jardins" covers both parks and gardens
  if (activeFilter.value === 'park') return spaces.value.filter(s => s.type === 'park' || s.type === 'garden')
  return spaces.value.filter(s => s.type === activeFilter.value)
})

async function loadSpaces() {
  loadingSpaces.value = true
  // The list mirrors the map: green_spaces + trees (escocells), in one fetch
  const [{ data: greenData }, { data: treeData }] = await Promise.all([
    supabase
      .from('green_spaces')
      .select('id, name, type, description, neighborhood, needs_help, participant_count'),
    supabase
      .from('trees')
      .select('id, name, species'),
  ])
  const greens = (greenData ?? []).map(g => ({
    ...g,
    acceptingApplications: mockAcceptingApplications(g),
  }))
  const escocells = (treeData ?? []).map(t => ({
    id: t.id,
    name: t.name ?? 'Escocell',
    type: 'tree',
    description: t.species,
    escocell: mockEscocellStatus(t),
  }))
  spaces.value = [...greens, ...escocells].sort((a, b) => a.name.localeCompare(b.name, 'ca'))
  loadingSpaces.value = false
}

watch(viewMode, (val) => { if (val === 'list' && !spaces.value.length) loadSpaces() })

const filters = [
  { value: 'all',      icon: 'map',          label: 'Tots els espais' },
  { value: 'park',     icon: 'trees',        label: 'Parcs i jardins' },
  { value: 'hort',     icon: 'carrot',       label: 'Horts urbans' },
  { value: 'tree',     icon: 'pine',         label: 'Àrbres (escocells)' },
  { value: 'mediator', icon: 'info-circle',  label: "Punts d'informació" },
  { value: 'help',     icon: 'lifebuoy',     label: 'On cal ajuda' },
]

// Real-time stats from Supabase
const stats = ref(null)

async function loadStats() {
  const [{ count: trees }, { count: mediators }, { count: participants }, { count: needsHelp }] = await Promise.all([
    supabase.from('trees').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'mediator'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('green_spaces').select('*', { count: 'exact', head: true }).eq('needs_help', true),
  ])
  stats.value = {
    trees: trees ?? 2847,
    mediators: mediators ?? 0,
    participants: participants ?? 0,
    needsHelp: needsHelp ?? 0,
  }
}

onMounted(loadStats)

// Realtime subscription — updates counters live
onMounted(() => {
  const channel = supabase
    .channel('stats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trees' }, loadStats)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadStats)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'green_spaces' }, loadStats)
    .subscribe()

  onUnmounted(() => supabase.removeChannel(channel))
})

</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
}

.map-wrapper {
  position: absolute;
  inset: 0;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d8f3dc;
  color: #2d6a4f;
  font-size: 18px;
}

/* Left filter panel */
.filter-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 10px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  z-index: 5;
  min-width: 170px;
  transition: min-width 0.2s;
}

.filter-panel.collapsed {
  min-width: unset;
}

.panel-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  color: #1b4332;
  background: #f0faf4;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.panel-toggle:hover { background: #d8f3dc; }

.toggle-label { flex: 1; text-align: left; }

.toggle-arrow {
  flex-shrink: 0;
  color: #4a7c59;
  transition: transform 0.2s;
}

.filter-divider {
  height: 1px;
  background: #e8f5ee;
  margin: 2px 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #4a5568;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}

.filter-btn:hover {
  background: #f0faf4;
  color: #1b4332;
}

.filter-btn.active {
  background: #2d6a4f;
  color: white;
}

.filter-btn.help-filter:hover { background: #fff5f5; color: #c53030; }
.filter-btn.help-filter.active { background: #e53e3e; }

.filter-icon { flex-shrink: 0; }

/* View toggle */
.view-toggle {
  position: absolute;
  top: 80px;
  right: 56px;
  display: flex;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 5;
  gap: 2px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
}
.view-btn:hover { background: #f0faf4; color: #1b4332; }
.view-btn.active { background: #2d6a4f; color: white; }

/* List overlay */
.list-overlay {
  position: absolute;
  top: 64px;
  left: 0; right: 0; bottom: 0;
  background: rgba(248, 249, 244, 0.97);
  backdrop-filter: blur(4px);
  overflow-y: auto;
  z-index: 4;
  /* larger padding-left so the list centers in the space to the right of the filter panel */
  padding: 24px 56px 24px 240px;
}

.list-loading, .list-empty {
  text-align: center;
  color: #718096;
  padding: 60px 0;
  font-size: 16px;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 920px;
  margin: 0 auto;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  border-radius: 14px;
  border-left: 3px solid var(--accent, #52b788);
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.10);
}

.list-item:focus-visible {
  outline: 2px solid #2d6a4f;
  outline-offset: 2px;
}

.list-item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.list-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.list-item-body strong {
  font-size: 15px;
  font-weight: 700;
  color: #1b4332;
}

.list-item-tag {
  font-size: 11px;
  font-weight: 600;
  color: #4a7c59;
  background: #d8f3dc;
  padding: 1px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.list-item-body p {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.list-item-meta {
  display: flex;
  align-items: center;
  gap: 5px;
}
.list-item-meta :deep(svg) { flex-shrink: 0; color: #a0aec0; }

.list-item-desc { color: #4a5568 !important; }

/* Coluna direita: badge "Cal ajuda" + seta de "anar al mapa" */
.list-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  align-self: center;
}

.list-item-help {
  font-size: 11px;
  font-weight: 700;
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  padding: 3px 10px;
  border-radius: 6px;
}

/* Escocell disponible badge — same amber as the map marker */
.list-item-available {
  font-size: 11px;
  font-weight: 700;
  color: #92740a;
  background: #fefce8;
  border: 1px solid #fde68a;
  padding: 3px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.list-item-go {
  color: #cbd5e0;
  transform: rotate(180deg); /* chevron-left → points to the right */
  transition: color 0.15s, transform 0.15s;
}
.list-item:hover .list-item-go {
  color: #2d6a4f;
  transform: rotate(180deg) translateX(-3px); /* slides to the right on hover */
}

/* Hero welcome overlay */
.hero-overlay {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 28px 32px 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.14);
  max-width: 440px;
  width: calc(100% - 240px);
  text-align: center;
}

.hero-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 28px;
  color: #a0aec0;
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
}
.hero-close:hover { color: #4a5568; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #2d6a4f;
  background: #d8f3dc;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.hero-title {
  font-size: 20px;
  font-weight: 800;
  color: #1b4332;
  line-height: 1.3;
  letter-spacing: -0.3px;
  margin-bottom: 10px;
}

.hero-desc {
  font-size: 14px;
  color: #4a7c59;
  line-height: 1.6;
  margin-bottom: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  /* Filter panel */
  .filter-panel { top: 68px; left: 12px; }

  /* List: the panel sits at the top on mobile, so no side offset is needed */
  .list-overlay { padding: 16px 14px; }

  /* Hero overlay */
  .hero-overlay {
    bottom: 20px;
    width: calc(100% - 32px);
    padding: 20px 20px 18px;
  }
  .hero-title { font-size: 17px; }
}
</style>
