<template>
  <main>
    <!-- Hero: Map Section -->
    <section class="hero">
      <NavBar />

      <div class="map-wrapper">
        <ClientOnly>
          <BarcelonaMap />
          <template #fallback>
            <div class="map-placeholder">Carregant mapa...</div>
          </template>
        </ClientOnly>

        <!-- Stats overlay -->
        <div class="stats-overlay">
          <div class="stat">
            <span class="stat-number">2.847</span>
            <span class="stat-label">Àrbres registrats</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-number">412</span>
            <span class="stat-label">Ambaixadors actius</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-number">73</span>
            <span class="stat-label">Barris participants</span>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <button class="filter-btn active">Tots els espais</button>
          <button class="filter-btn">Parcs i jardins</button>
          <button class="filter-btn">Horts urbans</button>
          <button class="filter-btn">Àrbres</button>
          <button class="filter-btn">On cal ajuda</button>
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
            <span class="card-emoji">{{ feature.emoji }}</span>
          </div>
          <div class="card-body">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <a :href="feature.href" class="card-link">
              {{ feature.cta }} →
            </a>
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
const features = [
  {
    id: 1,
    emoji: '🌳',
    title: "Ambaixadors d'Arbres",
    description: 'Adopta un arbre al teu barri. Cuida\'l, segueix el seu creixement i guanya reconeixement per la teva feina.',
    cta: 'Converteix-te en ambaixador',
    href: '/ambaixadors',
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
  },
  {
    id: 2,
    emoji: '🤝',
    title: 'Xarxa de Mediadors',
    description: 'Mercats, metges, perruqueries i comerços de barri que connecten veïns amb el moviment verd.',
    cta: 'Uneix-te a la xarxa',
    href: '/mediadors',
    gradient: 'linear-gradient(135deg, #276221 0%, #52b788 100%)',
  },
  {
    id: 3,
    emoji: '📋',
    title: 'Com Participar',
    description: 'Des de voluntari fins a ambaixador, hi ha un rol per a tothom. Descobreix com pots contribuir.',
    cta: 'Veure les opcions',
    href: '/participar',
    gradient: 'linear-gradient(135deg, #40916c 0%, #74c69d 100%)',
  },
  {
    id: 4,
    emoji: '🎉',
    title: 'Festa Anual',
    description: 'Cada any celebrem els veïns més compromesos. Lliurament de premis i nomenament d\'ambaixadors.',
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

/* Stats overlay */
.stats-overlay {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 20px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 32px;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #1b4332;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 13px;
  color: #4a7c59;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #d8f3dc;
}

/* Filter bar */
.filter-bar {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 5;
  white-space: nowrap;
}

.filter-btn {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #4a5568;
  transition: all 0.15s;
}

.filter-btn:hover {
  background: #d8f3dc;
  color: #1b4332;
}

.filter-btn.active {
  background: #2d6a4f;
  color: white;
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

.card-emoji {
  font-size: 48px;
}

.card-body {
  padding: 24px;
}

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

.card-link:hover {
  color: #1b4332;
}

/* Footer */
.footer {
  padding: 32px 48px;
  text-align: center;
  border-top: 1px solid #e2e8e0;
  color: #718096;
  font-size: 14px;
}
</style>
