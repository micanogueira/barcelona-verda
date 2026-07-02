<template>
  <div class="auth-page">
    <div class="auth-card">
      <NuxtLink to="/" class="back-link">{{ t('login.back') }}</NuxtLink>

      <div class="auth-logo">
        <AppIcon name="leaf" :size="22" class="logo-icon" />
        Barcelona Verda
      </div>

      <div class="auth-tabs">
        <button :class="['tab', { active: mode === 'login' }]" @click="mode = 'login'">{{ t('login.loginTab') }}</button>
        <button :class="['tab', { active: mode === 'register' }]" @click="mode = 'register'">{{ t('login.registerTab') }}</button>
      </div>

      <!-- Login -->
      <form v-if="mode === 'login'" class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>{{ t('login.email') }}</label>
          <input v-model="email" type="email" :placeholder="t('login.emailPlaceholder')" required />
        </div>
        <div class="field">
          <label>{{ t('login.password') }}</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? t('login.loggingIn') : t('login.loginBtn') }}
        </button>
      </form>

      <!-- Register -->
      <form v-else class="auth-form" @submit.prevent="handleRegister">
        <div class="field">
          <label>{{ t('login.fullName') }}</label>
          <input v-model="name" type="text" :placeholder="t('login.namePlaceholder')" required />
        </div>
        <div class="field">
          <label>{{ t('login.email') }}</label>
          <input v-model="email" type="email" :placeholder="t('login.emailPlaceholder')" required />
        </div>
        <div class="field">
          <label>{{ t('login.password') }}</label>
          <input v-model="password" type="password" :placeholder="t('login.passwordHintRegister')" required minlength="8" />
        </div>
        <div class="field">
          <label>{{ t('login.roleQuestion') }}</label>
          <select v-model="role">
            <option value="mediator">{{ t('login.roleMediator') }}</option>
            <option value="volunteer">{{ t('login.roleVolunteer') }}</option>
          </select>
          <span class="field-hint">
            <NuxtLink to="/participar">{{ t('login.discoverDiff') }}</NuxtLink>
          </span>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? t('login.registering') : t('login.createAccount') }}
        </button>
      </form>
    </div>

    <!-- Side panel -->
    <div class="auth-side">
      <div class="side-content">
        <h2>{{ t('login.sideTitle') }}</h2>
        <ul class="side-list">
          <li><AppIcon name="map2" :size="20" />{{ t('login.side1') }}</li>
          <li><AppIcon name="topology-star-3" :size="20" />{{ t('login.side2') }}</li>
          <li><AppIcon name="leaf" :size="20" />{{ t('login.side3') }}</li>
          <li><AppIcon name="users" :size="20" />{{ t('login.side4') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useLocale()
const supabase = useSupabaseClient()
const router = useRouter()

const mode = ref('login')
const email = ref('')
const password = ref('')
const name = ref('')
const role = ref('mediator')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (err) { error.value = err.message; return }
  router.push('/')
}

async function handleRegister() {
  loading.value = true
  error.value = ''
  const { data, error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { data: { full_name: name.value, role: role.value } },
  })
  loading.value = false
  if (err) { error.value = err.message; return }
  router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.auth-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px;
  background: white;
}

.back-link {
  color: #2d6a4f;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 40px;
  display: inline-block;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 800;
  color: #1b4332;
  margin-bottom: 32px;
}

.logo-icon { color: #2d6a4f; flex-shrink: 0; }

.auth-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e2e8e0;
  margin-bottom: 32px;
}

.tab {
  padding: 10px 24px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.15s;
}

.tab.active {
  color: #1b4332;
  border-bottom-color: #2d6a4f;
  font-weight: 700;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 360px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.field input,
.field select {
  padding: 10px 14px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 15px;
  color: #1a202c;
  transition: border-color 0.15s;
  background: white;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #2d6a4f;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.1);
}

.field-hint {
  font-size: 12px;
  color: #718096;
}
.field-hint a {
  color: #2d6a4f;
  text-decoration: none;
  font-weight: 600;
}
.field-hint a:hover { text-decoration: underline; }

.error-msg {
  color: #e53e3e;
  font-size: 14px;
}

.btn-submit {
  padding: 12px;
  background: #2d6a4f;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-submit:hover:not(:disabled) {
  background: #1b4332;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Side panel */
.auth-side {
  background: #1b4332;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
}

.side-content h2 {
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1.3;
  margin-bottom: 32px;
}

.side-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 17px;
  font-weight: 500;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-side { display: none; }
  .auth-card { padding: 40px 24px; justify-content: flex-start; padding-top: 48px; }
  .auth-form { max-width: 100%; }
}
</style>
