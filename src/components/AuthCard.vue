<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="../assets/logo.svg" alt="LetsQuiz Logo" class="auth-logo">
        <h1>{{ title }}</h1>
        <p class="auth-subtitle">{{ subtitle }}</p>
      </div>

      <form @submit.prevent="$emit('submit')" class="auth-form">
        <slot></slot>
      </form>

      <div class="auth-footer">
        <p>
          {{ footerText }}
          <router-link :to="footerLink" class="auth-link">
            {{ footerLinkText }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthCard',
  props: {
    title: String,
    subtitle: String,
    footerText: String,
    footerLink: String,
    footerLinkText: String
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  padding: 7rem 1rem;
  z-index: 1;
  overflow-y: auto;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 420px;
  margin: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 64px;
  height: auto;
  margin-bottom: 1.5rem;
}

.auth-subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.auth-link {
  color: #3B82F6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #2563EB;
}
</style>