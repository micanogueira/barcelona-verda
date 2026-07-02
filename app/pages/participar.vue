<template>
  <div class="page">
    <NavBar />

    <header class="page-header">
      <h1>{{ t('participate.title') }}</h1>
      <p>{{ t('participate.intro1') }}</p>
      <p>{{ t('participate.intro2') }}</p>
    </header>

    <!-- All participation options — unified grid -->
    <section class="all-options">
      <div class="official-grid">

        <div v-for="role in roles" :key="role.id" class="official-card" :style="{ borderTopColor: role.color }">
          <div class="official-card-top">
            <div class="official-icon-badge" :style="{ background: role.color }">
              <AppIcon :name="role.icon" :size="22" />
            </div>
          </div>
          <h3>{{ role.title }}</h3>
          <p class="official-desc">{{ role.description }}</p>
          <ul class="card-actions">
            <li v-for="action in role.actions" :key="action">
              <AppIcon name="check" :size="12" class="check-icon" />{{ action }}
            </li>
          </ul>
          <NuxtLink to="/login" class="btn-card">{{ role.cta }}</NuxtLink>
        </div>

        <div v-for="prog in officialPrograms" :key="prog.id" class="official-card" :style="{ borderTopColor: prog.color }">
          <div class="official-card-top">
            <div class="official-icon-badge" :style="{ background: prog.color }">
              <AppIcon :name="prog.icon" :size="22" />
            </div>
            <span class="official-tag">{{ t('participate.officialTag') }}</span>
          </div>
          <h3>{{ prog.title }}</h3>
          <p class="official-desc">{{ prog.description }}</p>
          <div class="official-bv-adds">
            <span class="official-bv-label">{{ t('participate.whatsNew') }}</span>
            <p>{{ prog.bvAdds }}</p>
          </div>
          <a :href="prog.officialUrl" target="_blank" rel="noopener" class="btn-card">
            {{ t('participate.accessProgram') }}
          </a>
        </div>

      </div>
    </section>

    <section class="how-it-works">
      <h2>{{ t('participate.howTitle') }}</h2>
      <div class="steps">
        <div v-for="(step, i) in steps" :key="i" class="step">
          <div class="step-num">{{ i + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
const { t } = useLocale()

// Roles/programs/steps are computed so their labels re-render on locale change.
// Official program titles stay as their Catalan proper names (they link to the
// Catalan municipal site); only the descriptive copy is translated.
const roles = computed(() => [
  {
    id: 'mediator',
    icon: 'topology-star-3',
    color: '#6366f1',
    title: t('participate.roles.mediator.title'),
    description: t('participate.roles.mediator.description'),
    actions: t('participate.roles.mediator.actions'),
    cta: t('participate.roles.mediator.cta'),
  },
  {
    id: 'volunteer',
    icon: 'heart',
    color: '#e2725b',
    title: t('participate.roles.volunteer.title'),
    description: t('participate.roles.volunteer.description'),
    actions: t('participate.roles.volunteer.actions'),
    cta: t('participate.roles.volunteer.cta'),
  },
])

const officialPrograms = computed(() => [
  {
    id: 1,
    icon: 'pine',
    color: '#52b788',
    title: "Cuida l'escocell",
    description: t('participate.programs.1.description'),
    bvAdds: t('participate.programs.1.bvAdds'),
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cuida-lescocell",
  },
  {
    id: 2,
    icon: 'carrot',
    color: '#e08e29',
    title: "Xarxa d'Horts Municipals",
    description: t('participate.programs.2.description'),
    bvAdds: t('participate.programs.2.bvAdds'),
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals",
  },
  {
    id: 3,
    icon: 'leaf',
    color: '#2d6a4f',
    title: "Cessió d'Espais Municipals",
    description: t('participate.programs.3.description'),
    bvAdds: t('participate.programs.3.bvAdds'),
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cessio-despais-municipals-dus-comunitari",
  },
  {
    id: 4,
    icon: 'users',
    color: '#c75c9e',
    title: "Cogestió d'Espais Públics",
    description: t('participate.programs.4.description'),
    bvAdds: t('participate.programs.4.bvAdds'),
    officialUrl: "https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics",
  },
])

const steps = computed(() => t('participate.steps'))
</script>

<style scoped>
.page { min-height: 100vh; background: #f8f9f4; }

.page-header {
  text-align: center;
  padding: 72px 48px 48px;
}
.page-header h1 { font-size: 42px; font-weight: 800; color: #1b4332; margin-bottom: 16px; letter-spacing: -0.5px; }
.page-header p { font-size: 18px; color: #4a7c59; max-width: 580px; margin: 0 auto 12px; }
.page-header-sub { font-size: 16px !important; color: #2d6a4f !important; font-weight: 600; }

/* margin-top aligns the check with the first text line when the text wraps onto multiple lines */
.check-icon { flex-shrink: 0; margin-top: 3px; }

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
  align-items: flex-start;
  gap: 7px;
  font-size: 13px;
  color: #2d6a4f;
  font-weight: 700;
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
  border-top: 4px solid transparent;
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
.official-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
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
