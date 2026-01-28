import { defineStore } from 'pinia';
import api from '../axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                // Get CSRF cookie first for Sanctum (though using token, good practice)
                await api.get('/sanctum/csrf-cookie').catch(() => { });

                const response = await api.post('/auth/login', credentials);

                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('token', this.token);

                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            try {
                const response = await api.get('/auth/user');
                this.user = response.data;
            } catch (error) {
                this.logout();
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout');
            } catch (e) {
                // ignore
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    }
});
