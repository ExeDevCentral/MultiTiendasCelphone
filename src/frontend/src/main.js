import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Global Error Handler
app.config.errorHandler = (err, instance, info) => {
    console.error("Global Error:", err);
    // Send to backend
    import('./axios').then(({ default: api }) => {
        api.post('/logs/client', {
            message: err.message,
            stack: err.stack,
            component: instance?.$options?.name || 'Anonymous',
            url: window.location.href,
            user_agent: navigator.userAgent
        }).catch(e => console.error("Failed to log error", e));
    });
};

app.mount('#app');
