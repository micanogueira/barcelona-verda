<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">
          <AppIcon name="leaf" :size="16" /> Barcelona Verda
        </span>
        <p>Una plataforma ciutadana per als espais verds urbans de Barcelona.</p>
        <p class="footer-academic">Projecte acadèmic · Sustainable Smart Cities · EuroTeQ 2026</p>
      </div>

      <nav class="footer-nav">
        <div class="footer-col">
          <span class="footer-col-title">Plataforma</span>
          <NuxtLink to="/">Mapa interactiu</NuxtLink>
          <NuxtLink to="/participar">Com Participar</NuxtLink>
          <NuxtLink to="/sobre">Sobre el projecte</NuxtLink>
          <NuxtLink to="/login">Entrar / Registrar-me</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Programes oficials</span>
          <a href="https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cuida-lescocell" target="_blank" rel="noopener">Cuida l'escocell</a>
          <a href="https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/xarxa-dhorts-municipals" target="_blank" rel="noopener">Xarxa d'Horts Municipals</a>
          <a href="https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cessio-despais-municipals-dus-comunitari" target="_blank" rel="noopener">Cessió d'Espais Municipals</a>
          <a href="https://ajuntament.barcelona.cat/espaisverds/ca/participa-hi/mans-al-verd/cogestio-despais-publics" target="_blank" rel="noopener">Cogestió d'Espais Públics</a>
          <a href="https://ajuntament.barcelona.cat/espaisverds/ca" target="_blank" rel="noopener">Espais Verds BCN ↗</a>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <span>© 2026 Barcelona Verda</span>
      <span class="footer-sep">·</span>
      <span>Jacob Stark · Marta Alfonso · Mehdike Ruveyda · Micaelle Nogueira</span>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #f8f9f4;
  border-top: 1px solid #e2e8e0;
  padding: 56px 48px 32px;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 64px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8e0;
  margin-bottom: 24px;
}

.footer-brand { display: flex; flex-direction: column; gap: 10px; }

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 17px;
  font-weight: 800;
  color: #1b4332;
}

.footer-brand p {
  font-size: 14px;
  color: #4a7c59;
  line-height: 1.6;
  max-width: 300px;
  margin: 0;
}

.footer-academic {
  font-size: 12px !important;
  color: #a0aec0 !important;
}

.footer-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #2d6a4f;
  margin-bottom: 4px;
}

.footer-col a {
  font-size: 14px;
  color: #4a5568;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-col a:hover { color: #1b4332; }

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #a0aec0;
}

.footer-sep { color: #e2e8e0; }

/* ── Mobile ── */
@media (max-width: 768px) {
  .footer { padding: 40px 24px 24px; }
  .footer-inner { grid-template-columns: 1fr; gap: 32px; }
  .footer-nav { grid-template-columns: 1fr 1fr; gap: 24px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 4px; }
}
</style>
