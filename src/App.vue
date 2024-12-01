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

export default {
  components: {
    NavigationComp,
    SideNav
  },
  computed: {
    showSideNav() {
      return this.$route.path !== '/login' && this.$route.path !== '/register';
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
