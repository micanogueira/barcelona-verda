<template>
  <main>
    <!-- Hero: Map Section -->
    <section class="hero">
      <NavBar :stats="stats" />

      <div class="map-wrapper">
        <ClientOnly>
          <BarcelonaMap />
          <template #fallback>
            <div class="map-placeholder">Carregant mapa...</div>
          </template>
        </ClientOnly>

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
              :class="['filter-btn', { active: activeFilter === f.value }]"
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

const filters = [
  { value: 'all',      icon: 'map',      label: 'Tots els espais' },
  { value: 'park',     icon: 'trees',    label: 'Parcs i jardins' },
  { value: 'hort',     icon: 'carrot',   label: 'Horts urbans' },
  { value: 'tree',     icon: 'pine',     label: 'Àrbres' },
  { value: 'mediator', icon: 'link2',    label: 'Mediadors' },
  { value: 'help',     icon: 'lifebuoy', label: 'On cal ajuda' },
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

.filter-icon { flex-shrink: 0; }

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

/* Footer */
.footer {
  padding: 32px 48px;
  text-align: center;
  border-top: 1px solid #e2e8e0;
  color: #718096;
  font-size: 14px;
}
</style>
