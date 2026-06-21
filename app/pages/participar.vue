<template>
  <div class="page">
    <nav class="topbar">
      <NuxtLink to="/" class="back">← Inici</NuxtLink>
      <span class="logo"><AppIcon name="leaf" :size="18" /> Barcelona Verd</span>
      <NuxtLink to="/login" class="btn-login">Entrar</NuxtLink>
    </nav>

    <header class="page-header">
      <h1>Com pots participar?</h1>
      <p>Totes les maneres de contribuir als espais verds de Barcelona, en un sol lloc. Des de registrar-te a la nostra plataforma fins a accedir als programes oficials de l'Ajuntament.</p>
    </header>

    <!-- Via Barcelona Verd -->
    <section class="roles">
      <div class="section-label">
        <AppIcon name="leaf" :size="15" />
        Registra't a Barcelona Verd
      </div>
      <div v-for="role in roles" :key="role.id" class="role-card">
        <div class="role-icon" :style="{ background: role.color }">
          <AppIcon :name="role.icon" :size="56" stroke-width="1.5" />
        </div>
        <div class="role-body">
          <h2>{{ role.title }}</h2>
          <p class="role-desc">{{ role.description }}</p>
          <ul class="role-actions">
            <li v-for="action in role.actions" :key="action">
              <AppIcon name="check" :size="14" class="check-icon" />{{ action }}
            </li>
          </ul>
          <NuxtLink to="/login" class="btn-role">{{ role.cta }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Via Programes Oficials -->
    <section class="official-programs">
      <div class="section-label section-label--blue">
        <AppIcon name="info-circle" :size="15" />
        Programes oficials de l'Ajuntament
      </div>
      <p class="official-intro">Aquests programes ja existeixen a la ciutat. Barcelona Verd t'ajuda a entendre'ls i accedir-hi de manera senzilla.</p>
      <div class="official-grid">
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
          <a :href="prog.officialUrl" target="_blank" rel="noopener" class="btn-official">
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
  { title: 'Registra\'t', text: 'Crea el teu compte en menys d\'un minut. Tria el teu rol i el teu barri.' },
  { title: 'Explora el mapa', text: 'Descobreix els espais verds, horts i arbres prop de tu. Veu on cal ajuda.' },
  { title: 'Participa', text: 'Apunta\'t com a voluntari, connecta el teu comerç o accedeix a un programa oficial.' },
  { title: 'Creix amb la comunitat', text: 'Rep reconeixement i inspira altres veïns a unir-se.' },
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
.logo { display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: 800; color: #1b4332; }
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
  min-height: 200px;
  color: rgba(255, 255, 255, 0.9);
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
.role-actions li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2d6a4f;
  font-weight: 500;
}
.check-icon { flex-shrink: 0; }

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

/* Section labels */
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #2d6a4f;
  background: #e8f5ec;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
}
.section-label--blue { color: #1d4ed8; background: #dbeafe; }

/* Official Programs Section */
.official-programs {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 48px 80px;
}
.official-intro {
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 32px;
  max-width: 600px;
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
.btn-official {
  display: inline-block;
  margin-top: auto;
  background: #1d4ed8;
  color: white;
  text-decoration: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.15s;
  align-self: flex-start;
}
.btn-official:hover { background: #1e3a8a; }

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
