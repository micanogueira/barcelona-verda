<template>
  <main>
    <!-- Hero: Map Section -->
    <section class="hero">
      <NavBar :stats="stats" />

      <div class="map-wrapper">
        <ClientOnly>
          <BarcelonaMap :filter="activeFilter" />
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
            <div v-for="space in filteredSpaces" :key="space.id" class="list-item">
              <div class="list-item-icon" :style="{ background: colorByType[space.type] }">
                <AppIcon :name="iconByType[space.type] ?? 'leaf'" :size="18" />
              </div>
              <div class="list-item-body">
                <strong>{{ space.name }}</strong>
                <span class="list-item-tag">{{ labelByType(space.type) }}</span>
                <p v-if="space.neighborhood">{{ space.neighborhood }}</p>
                <p v-if="space.description" class="list-item-desc">{{ space.description }}</p>
              </div>
              <div v-if="space.needs_help" class="list-item-help">Cal ajuda</div>
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

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="features-header">
        <h2>Com pots participar?</h2>
        <p>Barcelona Verd connecta veïns, voluntaris i la ciutat per crear espais verds junts.</p>
      </div>

      <div class="cards-grid">
        <div v-for="feature in features" :key="feature.id" class="card">
          <div class="card-image" :style="{ background: feature.gradient }">
            <AppIcon :name="feature.icon" :size="40" class="card-emoji" />
          </div>
          <div class="card-body">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <NuxtLink :to="feature.href" class="card-link">
              {{ feature.cta }} →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Programes Oficials Section -->
    <section class="official">
      <div class="official-header">
        <span class="official-badge">
          <AppIcon name="lifebuoy" :size="14" /> En col·laboració amb l'Ajuntament de Barcelona
        </span>
        <h2>La porta d'entrada als programes de la ciutat</h2>
        <p>Barcelona Verd connecta directament amb els programes oficials d'Espais Verds. Troba'ls, entén-los i participa — sense burocràcia.</p>
      </div>

      <div class="official-grid">
        <div v-for="prog in officialPrograms" :key="prog.id" class="official-card">
          <div class="official-card-top">
            <AppIcon :name="prog.icon" :size="28" class="official-icon" />
            <span class="official-tag">Programa oficial</span>
          </div>
          <h3>{{ prog.title }}</h3>
          <p class="official-desc">{{ prog.description }}</p>
          <div class="official-bv-adds">
            <span class="official-bv-label">Barcelona Verd afegeix</span>
            <p>{{ prog.bvAdds }}</p>
          </div>
          <a :href="prog.officialUrl" target="_blank" rel="noopener" class="official-link">
            Accedeix al programa oficial →
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 Barcelona Verd · Una iniciativa ciutadana per als espais verds urbans</p>
    </footer>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient()

const activeFilter = ref('all')
const panelOpen = ref(true)
const viewMode = ref('map')

const iconByType = { park: 'trees', garden: 'flower', hort: 'carrot', mediator: 'info-circle', tree: 'pine' }
const colorByType = { park: '#2d6a4f', garden: '#c75c9e', hort: '#e08e29', mediator: '#6366f1', tree: '#52b788' }
function labelByType(type) {
  return { park: 'Parc', garden: 'Jardí', hort: 'Hort urbà', mediator: "Punt d'informació", tree: 'Arbre' }[type] ?? type
}

const spaces = ref([])
const loadingSpaces = ref(false)
const filteredSpaces = computed(() => {
  if (activeFilter.value === 'all') return spaces.value
  if (activeFilter.value === 'help') return spaces.value.filter(s => s.needs_help)
  return spaces.value.filter(s => s.type === activeFilter.value)
})

async function loadSpaces() {
  loadingSpaces.value = true
  const { data } = await supabase
    .from('green_spaces')
    .select('id, name, type, description, neighborhood, needs_help, participant_count')
    .order('name')
  spaces.value = data ?? []
  loadingSpaces.value = false
}

watch(viewMode, (val) => { if (val === 'list' && !spaces.value.length) loadSpaces() })

const filters = [
  { value: 'all',      icon: 'map',          label: 'Tots els espais' },
  { value: 'park',     icon: 'trees',        label: 'Parcs i jardins' },
  { value: 'garden',   icon: 'flower',       label: 'Jardins' },
  { value: 'hort',     icon: 'carrot',       label: 'Horts urbans' },
  { value: 'tree',     icon: 'pine',         label: 'Àrbres' },
  { value: 'mediator', icon: 'info-circle',  label: "Punts d'informació" },
  { value: 'help',     icon: 'lifebuoy',     label: 'On cal ajuda' },
]

// Real-time stats from Supabase
const stats = ref(null)

async function loadStats() {
  const [{ count: trees }, { count: ambassadors }, { data: spaces }] = await Promise.all([
    supabase.from('trees').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'ambassador'),
    supabase.from('green_spaces').select('neighborhood'),
  ])
  const neighborhoods = new Set(spaces?.map(s => s.neighborhood).filter(Boolean)).size
  stats.value = {
    trees: trees ?? 2847,
    ambassadors: ambassadors ?? 412,
    neighborhoods: neighborhoods || 73,
  }
}

onMounted(loadStats)

// Realtime subscription — updates counters live
onMounted(() => {
  const channel = supabase
    .channel('stats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trees' }, loadStats)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadStats)
    .subscribe()

  onUnmounted(() => supabase.removeChannel(channel))
})

const officialPrograms = [
  {
    id: 1,
    icon: 'trees',
    title: "Cuida l'escocell",
    description: "Programa municipal d'adopció d'escocells (els espais de terra al voltant dels arbres). Qualsevol veí +18 anys pot apadrinar fins a 3 arbres.",
    bvAdds: "Seguiment visual del progrés, historial de cura, perfil públic d'ambaixador i reconeixement anual — la Prefeitura té el programa però no la capa digital de comunitat.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cuida-lescocell",
  },
  {
    id: 2,
    icon: 'carrot',
    title: "Xarxa d'Horts Municipals",
    description: "15 horts municipals repartits pels 10 districtes, amb parcel·les per a persones +65 anys i entitats. Sorteig públic anual.",
    bvAdds: "Vagas disponibles en temps real, alertes per a noves convocatòries i candidatura simplificada — la web oficial només té PDFs descarregables.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals",
  },
  {
    id: 3,
    icon: 'leaf',
    title: "Mans al Verd",
    description: "Programa paraigua que inclou horts, cessió d'espais, cogestió i adoció d'escocells. El gran marc de participació ciutadana en espais verds.",
    bvAdds: "Mapa de projectes actius, comptador de participants i visibilitat de qui ja participa al teu barri — el programa existeix però és invisible per a la majoria.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd",
  },
  {
    id: 4,
    icon: 'users',
    title: "Cogestió d'Espais Públics",
    description: "Entitats sense ànim de lucre poden cogestionar parterres, jardineres o basses naturalitzades durant 2 anys, via formulari.",
    bvAdds: "Llista pública d'entitats en cogestió al mapa, inspirant noves candidatures — ara mateix cap ciutadà sap quines entitats ja gestionen espais al seu barri.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics",
  },
]

const features = [
  {
    id: 1,
    icon: 'pine',
    title: "Ambaixadors d'Arbres",
    description: "Adopta un arbre al teu barri. Cuida'l, segueix el seu creixement i guanya reconeixement per la teva feina.",
    cta: 'Converteix-te en ambaixador',
    href: '/ambaixadors',
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
  },
  {
    id: 2,
    icon: 'link2',
    title: 'Xarxa de Mediadors',
    description: 'Mercats, metges, perruqueries i comerços de barri que connecten veïns amb el moviment verd.',
    cta: 'Uneix-te a la xarxa',
    href: '/mediadors',
    gradient: 'linear-gradient(135deg, #276221 0%, #52b788 100%)',
  },
  {
    id: 3,
    icon: 'clipboard-list',
    title: 'Com Participar',
    description: "Des de voluntari fins a ambaixador, hi ha un rol per a tothom. Descobreix com pots contribuir.",
    cta: 'Veure les opcions',
    href: '/participar',
    gradient: 'linear-gradient(135deg, #40916c 0%, #74c69d 100%)',
  },
  {
    id: 4,
    icon: 'confetti',
    title: 'Festa Anual',
    description: "Cada any celebrem els veïns més compromesos. Lliurament de premis i nomenament d'ambaixadors.",
    cta: 'Saber-ne més',
    href: '/festa',
    gradient: 'linear-gradient(135deg, #d4a017 0%, #f4c842 100%)',
  },
]
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
  padding: 24px 48px;
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
  max-width: 860px;
  margin: 0 auto;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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

.list-item-desc { color: #4a5568 !important; }

.list-item-help {
  font-size: 11px;
  font-weight: 700;
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  padding: 3px 10px;
  border-radius: 6px;
  align-self: center;
  flex-shrink: 0;
}

/* Features */
.features {
  padding: 80px 48px;
  background: #f8f9f4;
}

.features-header {
  text-align: center;
  margin-bottom: 48px;
}

.features-header h2 {
  font-size: 36px;
  font-weight: 800;
  color: #1b4332;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.features-header p {
  font-size: 18px;
  color: #4a7c59;
  max-width: 540px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-emoji { color: #fff; }

.card-body { padding: 24px; }

.card-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1b4332;
  margin-bottom: 10px;
}

.card-body p {
  font-size: 14px;
  color: #5a6872;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-link {
  font-size: 14px;
  font-weight: 600;
  color: #2d6a4f;
  text-decoration: none;
  transition: color 0.15s;
}

.card-link:hover { color: #1b4332; }

/* Official Programs */
.official {
  padding: 80px 48px;
  background: #f0f7ff;
}

.official-header {
  text-align: center;
  margin-bottom: 48px;
}

.official-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.3px;
}

.official-header h2 {
  font-size: 34px;
  font-weight: 800;
  color: #1a2e1a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.official-header p {
  font-size: 17px;
  color: #4a5568;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}

.official-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.official-card {
  background: white;
  border-radius: 16px;
  padding: 28px 24px 24px;
  box-shadow: 0 2px 12px rgba(0,0,80,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 3px solid #1d4ed8;
  transition: transform 0.2s, box-shadow 0.2s;
}

.official-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,80,0.1);
}

.official-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.official-icon { color: #1d4ed8; }

.official-tag {
  font-size: 10px;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.official-card h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1a2e1a;
  line-height: 1.3;
}

.official-desc {
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
  flex: 1;
}

.official-bv-adds {
  background: #f0faf4;
  border-left: 3px solid #2d6a4f;
  padding: 10px 12px;
  border-radius: 0 8px 8px 0;
}

.official-bv-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #2d6a4f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.official-bv-adds p {
  font-size: 12px;
  color: #4a7c59;
  line-height: 1.5;
  margin: 0;
}

.official-link {
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: none;
  margin-top: auto;
  transition: color 0.15s;
}

.official-link:hover { color: #1e3a8a; }

/* Footer */
.footer {
  padding: 32px 48px;
  text-align: center;
  border-top: 1px solid #e2e8e0;
  color: #718096;
  font-size: 14px;
}
</style>
