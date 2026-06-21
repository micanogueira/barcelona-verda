<template>
  <div class="page">
    <nav class="topbar">
      <NuxtLink to="/" class="back">← Inici</NuxtLink>
      <span class="logo">🌿 Barcelona Verd</span>
      <NuxtLink to="/login" class="btn-login">Entrar</NuxtLink>
    </nav>

    <header class="page-header">
      <h1>Com pots participar?</h1>
      <p>Tria el rol que millor s'adapta a tu. No cal experiència prèvia — només ganes de fer Barcelona més verda.</p>
    </header>

    <section class="roles">
      <div v-for="role in roles" :key="role.id" class="role-card">
        <div class="role-icon" :style="{ background: role.color }">{{ role.emoji }}</div>
        <div class="role-body">
          <h2>{{ role.title }}</h2>
          <p class="role-desc">{{ role.description }}</p>
          <ul class="role-actions">
            <li v-for="action in role.actions" :key="action">✓ {{ action }}</li>
          </ul>
          <NuxtLink to="/login" class="btn-role">{{ role.cta }}</NuxtLink>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>Com funciona?</h2>
      <div class="steps">
        <div v-for="(step, i) in steps" :key="i" class="step">
          <div class="step-num">{{ i + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const roles = [
  {
    id: 'ambassador',
    emoji: '🌳',
    title: "Ambaixador/a d'Arbres",
    color: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
    description: 'Adoptes un o més arbres al teu barri. Els cuides, reportes el seu estat i construeixes un vincle amb l\'espai verd de la teva comunitat.',
    actions: [
      'Registra arbres al mapa interactiu',
      'Rep eines digitals de seguiment',
      'Guanya punts i reconeixement',
      'Nomenament oficial a la Festa Anual',
    ],
    cta: 'Convertir-me en ambaixador/a',
  },
  {
    id: 'mediator',
    emoji: '🤝',
    title: 'Mediador/a de Xarxa',
    color: 'linear-gradient(135deg, #276221, #52b788)',
    description: 'Ets un comerç, mercat, metge, perruqueria o entitat local. Ajudes a connectar els teus clients i veïns amb la plataforma, actuant com a punt de confiança.',
    actions: [
      'Rep kit de comunicació (pòsters, flyers)',
      'Accés a formació de 30 minuts',
      'Aparèixes al mapa com a punt d\'informació',
      'Premi anual al mediador/a més actiu/va',
    ],
    cta: 'Unir-me com a mediador/a',
  },
  {
    id: 'volunteer',
    emoji: '🙌',
    title: 'Voluntari/ària',
    color: 'linear-gradient(135deg, #40916c, #74c69d)',
    description: 'Dones hores per ajudar en jornades de plantació, manteniment o acompanyament de persones grans que volen participar però necessiten suport digital.',
    actions: [
      'Participa en jornades de plantació',
      'Ajuda persones grans a usar la plataforma',
      'Coordina activitats als parcs',
      'Certificat de voluntariat oficial',
    ],
    cta: 'Apuntar-me com a voluntari/ària',
  },
  {
    id: 'citizen',
    emoji: '👋',
    title: 'Ciutadà/ana',
    color: 'linear-gradient(135deg, #d4a017, #f4c842)',
    description: 'Explora el mapa, descobreix els espais verds del teu barri, proposa millores i segueix el creixement de Barcelona Verd des de casa.',
    actions: [
      'Explora el mapa interactiu',
      'Proposa nous espais verds',
      'Segueix els teus ambaixadors locals',
      'Participa a la Festa Anual',
    ],
    cta: 'Crear compte gratuït',
  },
]

const steps = [
  { title: 'Registra\'t', text: 'Crea el teu compte en menys d\'un minut. Tria el teu rol i el teu barri.' },
  { title: 'Explora el mapa', text: 'Descobreix els espais verds, horts i arbres prop de tu. Veu on cal ajuda.' },
  { title: 'Participa', text: 'Adopta un arbre, apunta\'t a una jornada o connecta el teu comerç a la xarxa.' },
  { title: 'Creix amb la comunitat', text: 'Acumula punts, rep reconeixement i inspira altres veïns a unir-se.' },
]
</script>

<style scoped>
.page { min-height: 100vh; background: #f8f9f4; }

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  background: white;
  border-bottom: 1px solid #e2e8e0;
}
.back { color: #2d6a4f; text-decoration: none; font-size: 14px; font-weight: 500; }
.logo { font-size: 18px; font-weight: 800; color: #1b4332; }
.btn-login {
  background: #2d6a4f; color: white; text-decoration: none;
  padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
}

.page-header {
  text-align: center;
  padding: 72px 48px 48px;
}
.page-header h1 { font-size: 42px; font-weight: 800; color: #1b4332; margin-bottom: 16px; letter-spacing: -0.5px; }
.page-header p { font-size: 18px; color: #4a7c59; max-width: 560px; margin: 0 auto; }

.roles {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 48px 80px;
}

.role-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  min-height: 200px;
}

.role-body { padding: 32px 36px; }
.role-body h2 { font-size: 22px; font-weight: 800; color: #1b4332; margin-bottom: 10px; }
.role-desc { color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 16px; }

.role-actions {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}
.role-actions li { font-size: 14px; color: #2d6a4f; font-weight: 500; }

.btn-role {
  display: inline-block;
  background: #2d6a4f;
  color: white;
  text-decoration: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s;
}
.btn-role:hover { background: #1b4332; }

/* How it works */
.how-it-works {
  background: #1b4332;
  padding: 72px 48px;
  text-align: center;
}
.how-it-works h2 { font-size: 32px; font-weight: 800; color: white; margin-bottom: 48px; }
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}
.step { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.step-num {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: #52b788;
  color: white;
  font-size: 20px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.step h3 { font-size: 16px; font-weight: 700; color: white; }
.step p { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.6; }
</style>
