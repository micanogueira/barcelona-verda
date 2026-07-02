<template>
  <div class="page">
    <NavBar />

    <!-- About Section -->
    <section class="about">
      <div class="about-inner">
        <div class="about-text">
          <span class="about-badge">{{ t('about.badge') }}</span>
          <h2>{{ t('about.title') }}</h2>
          <p>{{ t('about.p1') }}</p>
          <p>{{ t('about.p2') }}</p>
          <p>{{ t('about.p3') }}</p>
          <ul class="about-list">
            <li>{{ t('about.li1') }}</li>
            <li>{{ t('about.li2') }}</li>
            <li>{{ t('about.li3') }}</li>
            <li>{{ t('about.li4') }}</li>
          </ul>
          <p>{{ t('about.p4') }}</p>
          <div class="about-team">
            <span class="about-team-label">{{ t('about.teamLabel') }}</span>
            <p>Jacob Stark · Marta Alfonso · Mehdike Ruveyda · Micaelle Nogueira</p>
            <p class="about-course">{{ t('about.course') }}</p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
const { t } = useLocale()
</script>

<style scoped>
.page { min-height: 100vh; background: #f8f9f4; }

/* About */
.about {
  padding: 80px 48px;
  background: white;
}

.about-inner {
  max-width: 760px;
  margin: 0 auto;
}

.about-badge {
  display: inline-block;
  background: #d8f3dc;
  color: #2d6a4f;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.3px;
}

.about-text h2 {
  font-size: 34px;
  font-weight: 800;
  color: #1a2e1a;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.about-text p {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.75;
  margin-bottom: 14px;
}

.about-text strong { color: #1b4332; }

.about-list {
  list-style: none;
  margin: 4px 0 18px;
  padding: 0 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-list li {
  position: relative;
  padding-left: 18px;
  font-size: 15px;
  color: #4a5568;
  line-height: 1.6;
}

.about-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2d6a4f;
}

.about-team {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e8f0e8;
}

.about-team-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #4a7c59;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.about-team p {
  font-size: 14px;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 4px;
}

.about-course {
  font-size: 13px !important;
  color: #718096 !important;
  font-weight: 400 !important;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .about { padding: 56px 24px; }
  .about-text h2 { font-size: 26px; }
}
</style>
