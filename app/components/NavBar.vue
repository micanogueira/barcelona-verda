<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <AppIcon name="leaf" :size="20" class="leaf-icon" />
      <span class="brand-name">Barcelona Verd</span>
    </div>

    <div v-if="stats" class="navbar-stats">
      <div class="counter">
        <span class="counter-num">{{ stats.trees.toLocaleString('ca') }}</span>
        <span class="counter-label">Àrbres</span>
      </div>
      <span class="counter-dot" />
      <div class="counter">
        <span class="counter-num">{{ stats.ambassadors.toLocaleString('ca') }}</span>
        <span class="counter-label">Ambaixadors</span>
      </div>
      <span class="counter-dot" />
      <div class="counter">
        <span class="counter-num">{{ stats.neighborhoods }}</span>
        <span class="counter-label">Barris</span>
      </div>
    </div>

    <div class="navbar-links">
      <a href="#map">Mapa</a>
      <NuxtLink to="/participar">Com Participar</NuxtLink>
      <a href="#official" class="btn-official">Programes Oficials</a>
      <a href="#about">Sobre</a>
      <NuxtLink to="/login" class="btn-login">Entrar</NuxtLink>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: null },
})
</script>

<style scoped>
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(45, 106, 79, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1b4332;
  flex-shrink: 0;
}

.leaf-icon { flex-shrink: 0; }

/* Stats counters */
.navbar-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.counter {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.counter-num {
  font-size: 16px;
  font-weight: 800;
  color: #1b4332;
  letter-spacing: -0.3px;
}

.counter-label {
  font-size: 12px;
  font-weight: 500;
  color: #4a7c59;
}

.counter-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b7e4c7;
}

/* Nav links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-shrink: 0;
}

.navbar-links a {
  text-decoration: none;
  color: #2d3748;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar-links a:hover { color: #2d6a4f; }

.btn-official {
  color: #1d4ed8 !important;
  background: #dbeafe;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 600 !important;
}

.btn-official:hover { background: #bfdbfe !important; color: #1e3a8a !important; }

.btn-login {
  background: #2d6a4f;
  color: white !important;
  padding: 7px 18px;
  border-radius: 8px;
  font-weight: 600 !important;
  transition: background 0.2s !important;
}

.btn-login:hover { background: #1b4332 !important; }
</style>
