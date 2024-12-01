import {createStore} from "vuex";
import Api from "@/services/api";

const store = createStore({
    state: {
        user: null,
        userLoggedIn: false,
        isStoreUpdated: false
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
            state.userLoggedIn = !!payload; // Synchronize login state with user presence
        },
        setUserIsLoggedIn(state, payload) {
            state.userLoggedIn = payload;
        },
        setIsStoreUpdated(state, payload) {
            state.isStoreUpdated = payload;
        }
    },
    actions: {
        async login(context, {email, password}) {
            try {
                const res = await Api.post("/users/login", {email, password});
                if (res?.data?.message === 'success') {
                    context.commit("setUser", res.data.data);
                    // No need to separately set userLoggedIn as it's handled in setUser mutation
                    return true;
                }
                throw new Error(res?.data?.error || "Login failed");
            } catch (err) {
                context.commit("setUser", null);
                throw err;
            }
        },
        async updateStore(context) {
            try {
                const res = await Api.get("/users");
                if (res?.data?.message === 'success') {
                    context.commit("setUser", res.data.data);
                }
            } catch (e) {
                context.commit("setUser", null);
            } finally {
                context.commit("setIsStoreUpdated", true);
            }
        },
        async logout(context) {
            try {
                const res = await Api.post("/users/logout");
                if (res?.data?.message === 'success') {
                    context.commit("setUser", null);
                }
            } catch (err) {
                console.error('Logout error:', err);
                throw err;
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.user,
        userRole: state => state.user?.role || null
    }
});

export default store;