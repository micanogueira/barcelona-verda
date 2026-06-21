<template>
  <div class="page">
    <nav class="topbar">
      <NuxtLink to="/" class="back">← Inici</NuxtLink>
      <NuxtLink to="/" class="logo"><AppIcon name="leaf" :size="18" /> Barcelona Verd</NuxtLink>
      <NuxtLink to="/login" class="topbar-login">Entrar</NuxtLink>
    </nav>

    <header class="page-header">
      <h1>Com pots participar?</h1>
      <p>El projecte Barcelona Verd connecta veïns, voluntaris i la ciutat per crear espais verds junts. Aquí trobaràs totes les formes de participació i els programes oficials, en un sol lloc.</p>
      <p class="page-header-sub">Siguis voluntari/ària, mediador/a o ciutadà/ana actiu/va, hi ha un rol per a tothom.</p>
    </header>

    <!-- All participation options — unified grid -->
    <section class="all-options">
      <div class="official-grid">

        <div v-for="role in roles" :key="role.id" class="official-card">
          <div class="official-card-top">
            <AppIcon :name="role.icon" :size="26" class="official-icon" />
          </div>
          <h3>{{ role.title }}</h3>
          <p class="official-desc">{{ role.description }}</p>
          <div class="official-bv-adds">
            <span class="official-bv-label">Amb Barcelona Verd</span>
            <ul class="card-actions">
              <li v-for="action in role.actions" :key="action">
                <AppIcon name="check" :size="12" class="check-icon" />{{ action }}
              </li>
            </ul>
          </div>
          <NuxtLink to="/login" class="btn-card">{{ role.cta }}</NuxtLink>
        </div>

        <div v-for="prog in officialPrograms" :key="prog.id" class="official-card">
          <div class="official-card-top">
            <AppIcon :name="prog.icon" :size="26" class="official-icon" />
            <span class="official-tag">Programa oficial</span>
          </div>
          <h3>{{ prog.title }}</h3>
          <p class="official-desc">{{ prog.description }}</p>
          <div class="official-bv-adds">
            <span class="official-bv-label">Barcelona Verd afegeix</span>
            <p>{{ prog.bvAdds }}</p>
          </div>
          <a :href="prog.officialUrl" target="_blank" rel="noopener" class="btn-card">
            Accedeix al programa →
          </a>
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
    id: 'mediator',
    icon: 'link2',
    title: 'Mediador/a de Xarxa',
    color: 'linear-gradient(135deg, #276221, #52b788)',
    description: 'Ets un comerç, mercat, metge, perruqueria o entitat local. Connectes els teus clients i veïns — especialment la gent gran — amb els espais verds i programes del barri, actuant com a punt de confiança.',
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
    icon: 'heart',
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
]

const officialPrograms = [
  {
    id: 1,
    icon: 'pine',
    title: "Cuida l'escocell",
    description: "Programa municipal d'adopció d'escocells (els espais de terra al voltant dels arbres). Qualsevol veí +18 anys pot apadrinar fins a 3 arbres.",
    bvAdds: "Seguiment visual del progrés, historial de cura i visibilitat al mapa — la Prefeitura té el programa però no la capa digital de comunitat.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cuida-lescocell",
  },
  {
    id: 2,
    icon: 'carrot',
    title: "Xarxa d'Horts Municipals",
    description: "15 horts municipals repartits pels 10 districtes, amb parcel·les per a persones +65 anys i entitats. Sorteig públic anual.",
    bvAdds: "Vagas disponibles en temps real i alertes per a noves convocatòries — la web oficial només té PDFs descarregables.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals",
  },
  {
    id: 3,
    icon: 'leaf',
    title: "Mans al Verd",
    description: "Programa paraigua que inclou horts, cessió d'espais, cogestió i adopció d'escocells. El gran marc de participació ciutadana en espais verds.",
    bvAdds: "Mapa de projectes actius i visibilitat de qui ja participa al teu barri — el programa existeix però és invisible per a la majoria.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd",
  },
  {
    id: 4,
    icon: 'users',
    title: "Cogestió d'Espais Públics",
    description: "Entitats sense ànim de lucre poden cogestionar parterres, jardineres o basses naturalitzades durant 2 anys, via formulari.",
    bvAdds: "Llista pública d'entitats en cogestió al mapa, inspirant noves candidatures — ara cap ciutadà sap quines entitats ja gestionen espais al seu barri.",
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics",
  },
]

const steps = [
  { title: 'Explora', text: 'Obre el mapa interactiu i descobreix els espais verds, horts i arbres del teu barri — sense necessitat de compte.' },
  { title: 'Tria com participar', text: 'Vols ser voluntari, mediador de xarxa o accedir directament a un programa oficial de l\'Ajuntament?' },
  { title: 'Registra\'t o accedeix', text: 'Crea el teu compte a Barcelona Verd per als rols de la plataforma, o accedeix al programa oficial que t\'interessa.' },
  { title: 'Fes créixer la xarxa', text: 'La teva participació és visible al mapa i inspira altres veïns dels 73 barris de Barcelona.' },
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
.logo { display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 800; color: #1b4332; text-decoration: none; }
.topbar-login { color: #2d3748; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
.topbar-login:hover { color: #2d6a4f; }

.page-header {
  text-align: center;
  padding: 72px 48px 48px;
}
.page-header h1 { font-size: 42px; font-weight: 800; color: #1b4332; margin-bottom: 16px; letter-spacing: -0.5px; }
.page-header p { font-size: 18px; color: #4a7c59; max-width: 580px; margin: 0 auto 12px; }
.page-header-sub { font-size: 16px !important; color: #2d6a4f !important; font-weight: 600; }

.check-icon { flex-shrink: 0; }

/* Unified options grid */
.all-options {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 48px 80px;
}

.card-actions {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 0;
}
.card-actions li {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #4a7c59;
  line-height: 1.4;
}

.official-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.official-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.official-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.official-icon { color: #2d6a4f; }
.official-tag {
  font-size: 11px;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 3px 10px;
  border-radius: 20px;
}
.official-card h3 { font-size: 17px; font-weight: 800; color: #1b4332; margin: 0; }
.official-desc { font-size: 14px; color: #4a5568; line-height: 1.6; margin: 0; }
.official-bv-adds {
  background: #f0faf4;
  border-left: 3px solid #52b788;
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
}
.official-bv-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #2d6a4f;
  margin-bottom: 4px;
}
.official-bv-adds p { font-size: 13px; color: #4a7c59; margin: 0; line-height: 1.5; }
.btn-card {
  display: inline-block;
  margin-top: auto;
  align-self: flex-start;
  background: #2d6a4f;
  color: white;
  text-decoration: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.15s;
}
.btn-card:hover { background: #1b4332; }

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

/* ── Mobile ── */
@media (max-width: 768px) {
  .topbar { padding: 16px 20px; }

  .page-header { padding: 48px 20px 32px; }
  .page-header h1 { font-size: 30px; }
  .page-header p { font-size: 16px; }

  .all-options { padding: 0 20px 56px; }
  .official-grid { grid-template-columns: 1fr; }

  .how-it-works { padding: 56px 20px; }
  .steps { grid-template-columns: 1fr 1fr; gap: 24px; }
}

@media (max-width: 480px) {
  .steps { grid-template-columns: 1fr; }
}
</style>
