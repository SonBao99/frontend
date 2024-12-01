<template>
  <AuthCard
    title="Create Your Account"
    subtitle="Join LetsQuiz and start your learning journey"
    footerText="Already have an account?"
    footerLink="/login"
    footerLinkText="Sign in"
    @submit="register"
  >
    <div class="form-group">
      <label for="username">Username</label>
      <div class="input-group">
        <i class="bi bi-person"></i>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="Choose a username"
          required
        >
      </div>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <div class="input-group">
        <i class="bi bi-envelope"></i>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="Enter your email"
          required
        >
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="input-group">
        <i class="bi bi-lock"></i>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Create a password"
          required
          @input="validatePasswords"
        >
      </div>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <div class="input-group">
        <i class="bi bi-lock-fill"></i>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          placeholder="Confirm your password"
          required
          @input="validatePasswords"
        >
      </div>
      <span v-if="passwordError" class="error-message">
        {{ passwordError }}
      </span>
    </div>

    <div class="form-group">
      <label>Role</label>
      <select v-model="role" required>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>

    <button type="submit" class="auth-button" :disabled="!isValid">
      Create Account
      <i class="bi bi-arrow-right"></i>
    </button>
  </AuthCard>
</template>

<script>
import AuthCard from '@/components/AuthCard.vue'
import Api from "@/services/api";

export default {
  name: "RegisterView",
  components: { AuthCard },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      passwordError: "",
      isValid: false,
      role: "student"
    }
  },
  methods: {
    validatePasswords() {
      if (this.password && this.confirmPassword) {
        if (this.password.length < 8) {
          this.passwordError = "Password must be at least 8 characters long";
          this.isValid = false;
        } else if (this.password !== this.confirmPassword) {
          this.passwordError = "Passwords do not match";
          this.isValid = false;
        } else {
          this.passwordError = "";
          this.isValid = true;
        }
      } else {
        this.passwordError = "";
        this.isValid = false;
      }
    },
    async register() {
      if (!this.isValid) return;
      
      try {
        const response = await Api.post("/users/register", {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        });

        if (response.data.message === "success") {
          this.$toast.success("Registration successful! Please log in.", {
            position: "bottom-left", 
            duration: 2000
          });
          this.$router.push("/login");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Registration failed";
        this.$toast.error(errorMessage, {
          position: "bottom-left", 
          duration: 3000
        });
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
  border: 1px solid #3B82F6;
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

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
}

.auth-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #4a5568;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group select:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>