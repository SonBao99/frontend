<template>
  <AuthCard title="Welcome Back!" subtitle="Sign in to continue your learning journey"
    footerText="Don't have an account?" footerLink="/register" footerLinkText="Sign up" @submit="login">
    <div class="form-group">
      <label for="email">Email</label>
      <div class="input-group">
        <i class="bi bi-envelope"></i>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required>
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="input-group">
        <i class="bi bi-lock"></i>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
      </div>
    </div>

    <div class="form-checkbox">
      <label class="checkbox-label">
        <input type="checkbox" v-model="rememberMe">
        <span class="checkbox-text">Remember me</span>
      </label>
    </div>

    <button type="submit" class="auth-button">
      Sign In
      <i class="bi bi-arrow-right"></i>
    </button>
  </AuthCard>
</template>

<script>
import AuthCard from '@/components/AuthCard.vue'
import axios from 'axios'

export default {
  name: "LoginView",
  components: { AuthCard },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://backend-chih.onrender.com/api/users/login', {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.user) {
          // First update Vuex store
          await this.$store.commit('setUserLoggedIn', true);
          await this.$store.commit('setUser', response.data.user);
          
          // Then update localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          // Navigate to quizzes page
          await this.$router.push("/quizzes");
          this.$toast.success("Logged in successfully.", {
            position: "bottom-left", 
            duration: 1000
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Login error:', err);
        let errorMessage = "Authentication failed!";
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        this.$toast.error(errorMessage, {
          position: "bottom-left",
          duration: 2000
        });
        
        // Clear any partial state
        this.$store.commit('setUserLoggedIn', false);
        this.$store.commit('setUser', null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
      }
    }
  }
}
</script>
<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group i {
  position: absolute;
  left: 1rem;
  color: #9CA3AF;
}

input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-button:hover {
  background: #2563EB;
  transform: translateY(-1px);
}

.form-checkbox {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border: 2px solid #3B82F6;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-text {
  color: #4a5568;
  font-size: 0.9rem;
}
</style>