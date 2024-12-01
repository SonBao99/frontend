<template>
  <nav class="navbar">
    <div class="nav-group">
      <router-link to="/" class="brand-container">
        <img src="../assets/logo.svg" alt="logo" class="brand-logo">
        <div class="brand-name">LetsQuiz</div>
      </router-link>
    </div>

    <div class="nav-group" v-if="!user">
      <router-link to="/login" class="nav-link">
        <div class="login-btn">Login</div>
      </router-link>
      <router-link to="/register" class="nav-link">
        <div class="register-btn">Register</div>
      </router-link>
    </div>

    <div class="nav-group" v-if="user">
      <router-link to="/user" class="nav-link">
        <div class="user-profile">
          <img v-if="user.avatar" :src="user.avatar" class="user-avatar-img" :alt="user.username">
          <span v-else class="user-avatar">{{ user.username.charAt(0) }}</span>
          <span class="username">{{ user.username }}</span>
        </div>
      </router-link>
      <div @click="logout" class="logout-btn">Log out</div>
    </div>
    
  </nav>
</template>

<script>
export default {
  name: "NavigationComp",
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
        if (!this.isUserLoggedIn) {
          this.$toast.success("Successfully logged out.", { position: "bottom-left", duration: 1000 });
          await this.$router.push("/login");
        }
      } catch (e) {
        console.log(e);
        this.$toast.error("Couldn't log out.", { position: "bottom-left", duration: 1000 });
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.brand-logo {
  width: 45px;
  height: auto;
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
}

.brand-name {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #3B82F6;
  letter-spacing: -0.5px;
}

.nav-link {
  text-decoration: none;
}

.login-btn,
.logout-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-btn:hover,
.logout-btn:hover {
  background-color: #f5f5f5;
  color: #3B82F6;
}

.register-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: #3B82F6;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background-color: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-profile:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #3B82F6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}
.user-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.username {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.logout-btn {
  cursor: pointer;
}
</style>