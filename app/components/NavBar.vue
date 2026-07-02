<template>
  <nav class="navbar" :class="{ floating }">
    <NuxtLink to="/" class="navbar-brand">
      <AppIcon name="leaf" :size="20" class="leaf-icon" />
      <span class="brand-name">Barcelona Verda</span>
    </NuxtLink>

    <div v-if="stats" class="navbar-stats">
      <div class="counter">
        <span class="counter-num">{{ stats.trees.toLocaleString(locale) }}</span>
        <span class="counter-label">{{ t('nav.stats.trees') }}</span>
      </div>
      <span class="counter-dot" />
      <div class="counter">
        <span class="counter-num">{{ stats.mediators.toLocaleString(locale) }}</span>
        <span class="counter-label">{{ t('nav.stats.mediators') }}</span>
      </div>
      <span class="counter-dot" />
      <div class="counter">
        <span class="counter-num">{{ stats.participants.toLocaleString(locale) }}</span>
        <span class="counter-label">{{ t('nav.stats.participants') }}</span>
      </div>
      <span class="counter-dot" />
      <div class="counter">
        <span class="counter-num">{{ stats.needsHelp.toLocaleString(locale) }}</span>
        <span class="counter-label">{{ t('nav.stats.needsHelp') }}</span>
      </div>
    </div>

    <div class="navbar-links">
      <NuxtLink to="/">{{ t('nav.home') }}</NuxtLink>
      <NuxtLink to="/participar" class="btn-login">{{ t('nav.participate') }}</NuxtLink>
      <NuxtLink to="/sobre">{{ t('nav.about') }}</NuxtLink>
      <NuxtLink to="/login">{{ t('nav.login') }}</NuxtLink>
      <div class="lang-toggle" role="group" aria-label="Language">
        <button :class="{ active: locale === 'ca' }" @click="setLocale('ca')">CA</button>
        <button :class="{ active: locale === 'es' }" @click="setLocale('es')">ES</button>
        <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: null },
  // floating = absolute bar over the map (home). Without floating = bar fixed to the top (content pages).
  floating: { type: Boolean, default: false },
})

const { t, locale, setLocale } = useLocale()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
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

/* Home: barra flutuante sobre o mapa */
.navbar.floating {
  position: absolute;
  left: 0;
  right: 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1b4332;
  text-decoration: none;
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

/* Current page highlighted */
.navbar-links a.router-link-exact-active {
  color: #2d6a4f;
  font-weight: 700;
}

.btn-login {
  background: #2d6a4f;
  color: white !important;
  padding: 7px 18px;
  border-radius: 8px;
  font-weight: 600 !important;
  transition: background 0.2s !important;
}

.btn-login:hover { background: #1b4332 !important; }

/* Language toggle (CA | EN) */
.lang-toggle {
  display: flex;
  gap: 2px;
  background: #f0faf4;
  border-radius: 8px;
  padding: 3px;
}

.lang-toggle button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  color: #4a7c59;
  padding: 3px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}

.lang-toggle button:hover { color: #1b4332; }

.lang-toggle button.active {
  background: #2d6a4f;
  color: white;
}

@media (max-width: 768px) {
  .navbar { padding: 0 20px; height: 56px; }
  .navbar-brand { font-size: 15px; }
  .navbar-stats { display: none; }
  .navbar-links { gap: 14px; }
  .navbar-links a { font-size: 13px; }
  .btn-login { padding: 6px 12px; font-size: 13px; }
  .lang-toggle button { padding: 3px 6px; font-size: 11px; }
}
</style>
