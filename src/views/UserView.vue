<template>
  <div class="view-body">
  <div class="profile-header">
    <h1>User Profile</h1>
    <router-link to="/user/edit" class="edit-profile-btn">
      <i class="bi bi-pencil"></i>
      Edit Profile
    </router-link>
  </div>
  <span><i class="bi bi-person"></i>{{ user.username }}</span>
  <span><i class="bi bi-envelope"></i>{{ user.email }}</span>
  <span><i class="bi bi-calendar"></i>{{ parseDate(user.registrationDate) }}</span>
</div>
</template>

<script>
export default {
  name: "UserView",
  methods: {
    parseDate(date) {
      return new Date(Date.parse(date)).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  },
  computed: {
    user() {
      this.parseDate(this.$store.state.user.registrationDate);
      return this.$store.state.user;
    }
  }
}
</script>

<style scoped>
.view-body {
  margin: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

span {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  font-size: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
}

.edit-profile-btn:hover {
  background-color: #e5e5e5;
  color: #00AA48;
}
</style>