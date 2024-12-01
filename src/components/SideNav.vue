<template>
    <nav class="side-nav" :class="{ 'collapsed': isCollapsed }">
        <div class="nav-items">
            <router-link to="/quizzes" class="nav-item" title="Quizzes">
                <i class="bi bi-journal-text"></i>
                <span v-if="!isCollapsed">Quizzes</span>
            </router-link>

            <router-link 
                v-if="isLoggedIn"
                to="/dashboard" 
                class="nav-item" 
                title="Dashboard">
                <i class="bi bi-speedometer2"></i>
                <span v-if="!isCollapsed">Dashboard</span>
            </router-link>

            <router-link to="/leaderboard" class="nav-item" title="Leaderboard">
                <i class="bi bi-trophy"></i>
                <span v-if="!isCollapsed">Leaderboard</span>
            </router-link>
        </div>

        <div class="nav-toggle" @click="toggleNav" :title="isCollapsed ? 'Expand' : 'Collapse'">
            <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'SideNav',
    data() {
        return {
            isCollapsed: true
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.userLoggedIn;
        }
    },
    methods: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        }
    }
}
</script>

<style scoped>
.side-nav {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 240px;
    background: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 900;
    padding-top: 80px;
}

.side-nav.collapsed {
    width: 60px;
}

.side-nav.collapsed .nav-item span {
    opacity: 0;
    transform: translateX(-10px);
}

.nav-item span {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 0;
}

.nav-links {
    flex: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    color: #4a5568;
    text-decoration: none;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
}

.nav-item i {
    font-size: 1.25rem;
    min-width: 24px;
    text-align: center;
}

.nav-item:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

.nav-item.active {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
    border-right: 3px solid #3B82F6;
}

.collapse-btn {
    margin: 1rem auto;
    padding: 0.5rem;
    background: none;
    border: none;
    color: #718096;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.collapse-btn:hover {
    background: #f7fafc;
    color: #00AA48;
}
.create-quiz {
    background: rgba(0, 170, 72, 0.1);
    margin: 1rem 1rem;
    border-radius: 8px;
    padding: 0.75rem 1rem;
}

.create-quiz:hover {
    background: rgba(0, 170, 72, 0.2);
    transform: translateX(4px);
}

.create-quiz.active {
    background: #3B82F6;
    color: white;
    border-right: none;
}

.side-nav.collapsed .create-quiz {
    margin: 1rem 0.5rem;
    padding: 0.75rem;
    justify-content: center;
}
</style>