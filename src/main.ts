import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.scss';
const appContainer = document.createElement('div');
appContainer.id = 'app';
document.body.appendChild(appContainer);
const pinia = createPinia();

const app = createApp(App)
app.mount('#app');
app.use(pinia);
