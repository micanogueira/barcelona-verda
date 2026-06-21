<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="leaf-icon">🌿</span>
      <span class="brand-name">Barcelona Verd</span>
    </div>
    <div class="navbar-links">
      <a href="#map">Mapa</a>
      <a href="#features">Com Participar</a>
      <a href="#about">Sobre</a>
      <NuxtLink to="/login" class="btn-login">Entrar</NuxtLink>
    </div>
  </nav>
</template>

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
  padding: 20px 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(45, 106, 79, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1b4332;
  text-decoration: none;
}

.leaf-icon {
  font-size: 22px;
}

.brand-name {
  letter-spacing: -0.3px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.navbar-links a {
  text-decoration: none;
  color: #2d3748;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar-links a:hover {
  color: #2d6a4f;
}

.btn-login {
  background: #2d6a4f;
  color: white !important;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600 !important;
  transition: background 0.2s !important;
}

.btn-login:hover {
  background: #1b4332 !important;
}
</style>
