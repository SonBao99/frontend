<template>
  <div class="app">
    <NavigationComp />
    <SideNav v-if="showSideNav" />
    <main :class="{ 'with-sidenav': showSideNav }">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavigationComp from './components/NavigationComp.vue';
import SideNav from './components/SideNav.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    NavigationComp,
    SideNav
  },
  computed: {
    showSideNav() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  },
  async created() {
    try {
      // Verify session with backend
      const response = await axios.get('https://backend-chih.onrender.com/api/users/verify-session', {
        withCredentials: true
      });
      
      if (response.data.isValid) {
        this.$store.commit('setUserLoggedIn', true);
        this.$store.commit('setUser', response.data.user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      } else {
        // Clear invalid session
        this.$store.commit('setUserLoggedIn', false);
        this.$store.commit('setUser', null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        
        // Redirect to login if not on login or register page
        if (!['/login', '/register'].includes(this.$route.path)) {
          this.$router.push('/login');
        }
      }
    } catch (error) {
      console.error('Session verification error:', error);
      // Handle session verification error
      this.$store.commit('setUserLoggedIn', false);
      this.$store.commit('setUser', null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      
      if (!['/login', '/register'].includes(this.$route.path)) {
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style>
main {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  padding-top: 0px;
}

main.with-sidenav {
  margin-left: 240px;
}

.side-nav.collapsed + main.with-sidenav {
  margin-left: 60px;
}

@media (max-width: 768px) {
  main.with-sidenav {
    margin-left: 60px;
  }
}
</style>
