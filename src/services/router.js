import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView";
import LoginView from "@/views/LoginView";
import RegisterView from "@/views/RegisterView";
import store from "@/services/store";
import UserView from "@/views/UserView";
import QuizzesView from "@/views/QuizView";
import QuizTestView from "@/views/QuizTestView";
import UserEditView from "@/views/UserEditView";
import LeaderboardView from '../views/LeaderboardView.vue';
import DashboardView from "@/views/DashboardView";
import QuizCreationView from '../views/QuizCreationView.vue'
import QuizEditView from '../views/QuizEditView.vue'

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
        meta: {
            title: "LetsQuiz",
            authRequired: false,
            authForbidden: false
        }
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: {
            title: "Login",
            authRequired: false,
            authForbidden: true
        },
    },
    {
        path: "/register",
        name: "register",
        component: RegisterView,
        meta: {
            title: "Register",
            authRequired: false,
            authForbidden: true
        },
    },
    {
        path: "/user",
        name: "user",
        component: UserView,
        meta: {
            title: "User profile",
            authRequired: true,
            authForbidden: false
        }
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: DashboardView,
        meta: {
            title: "Dashboard",
            authRequired: true,
            authForbidden: false
        }
    },
    {
        path: "/quizzes",
        name: "quizzes",
        component: QuizzesView,
        meta: {
            title: "Quizzes",
            authRequired: true,
            authForbidden: false
        }
    },
    {
        path: '/quizzes/:id',
        name: 'quiz',
        component: QuizTestView,
    },
    {
        path: "/user/edit",
        name: "user-edit",
        component: UserEditView,
        meta: {
            title: "Edit Profile",
            authRequired: true,
            authForbidden: false
        }
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: LeaderboardView,
        meta: { title: 'Leaderboard - LetsQuiz' }
    },
    {
        path: '/quizzes/create',
        name: 'QuizCreation',
        component: QuizCreationView,
        meta: { 
            title: 'Create Quiz',
            requiresAuth: true,
            role: 'teacher'
        }
    },
    {
        path: '/quizzes/:id/edit',
        name: 'QuizEdit',
        component: QuizEditView,
        meta: { title: 'Edit Quiz', requiresAuth: true, role: 'teacher' }
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// routes protection
router.beforeEach(async (to, from, next) => {
    // update store if needed
    if (!store.state.isStoreUpdated) {
        await store.dispatch("updateStore");
    }

    const isAuthenticated = store.state.userLoggedIn;
    const userRole = store.state.user?.role;

    if (!isAuthenticated && to.meta.requiresAuth) {
        next({name: "login"});
    } else if (isAuthenticated && to.meta.authForbidden) {
        next({name: "user"});
    } else if (to.meta.role && to.meta.role !== userRole) {
        // Redirect to home if user doesn't have required role
        next({name: "home"});
    } else {
        next();
    }
});

router.afterEach((to) => {
    document.title = to.meta.title;
});

export default router;
