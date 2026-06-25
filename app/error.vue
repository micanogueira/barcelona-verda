<template>
  <div class="error-page">
    <NavBar />

    <main class="error-main">
      <div class="error-card">
        <div class="error-icon">
          <AppIcon name="map2" :size="38" />
        </div>
        <span class="error-code">{{ is404 ? '404' : error.statusCode }}</span>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <button class="error-cta" @click="goHome">Torna al mapa →</button>
      </div>
    </main>
  </div>
</template>

<script setup>
const props = defineProps({
  error: { type: Object, default: () => ({}) },
})

const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
  is404.value
    ? 'Aquesta pàgina no surt al mapa'
    : 'Alguna cosa ha anat malament',
)

const description = computed(() =>
  is404.value
    ? "Sembla que t'has desviat del camí. Tornem als espais verds de Barcelona?"
    : "Hi ha hagut un error inesperat. Torna a l'inici i continua explorant.",
)

useHead({ title: `${is404.value ? '404' : 'Error'} · Barcelona Verda` })

const goHome = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: #f8f9f4;
  display: flex;
  flex-direction: column;
}

.error-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px 64px;
}

.error-card {
  text-align: center;
  max-width: 440px;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #d8f3dc;
  color: #2d6a4f;
  margin-bottom: 24px;
}

.error-code {
  display: block;
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
  color: #1b4332;
  margin-bottom: 16px;
}

.error-card h1 {
  font-size: 24px;
  font-weight: 800;
  color: #1b4332;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}

.error-card p {
  font-size: 15px;
  color: #4a7c59;
  line-height: 1.6;
  margin-bottom: 28px;
}

.error-cta {
  background: #2d6a4f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 10px;
  transition: background 0.15s;
}
.error-cta:hover { background: #1b4332; }

@media (max-width: 768px) {
  .error-code { font-size: 52px; }
  .error-card h1 { font-size: 20px; }
}
</style>
