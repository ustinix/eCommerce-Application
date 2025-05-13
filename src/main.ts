import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import App from './app.vue';
import './style.scss';
import router from './router/router';
import pinia from './stores/pinia';

const appContainer = document.createElement('div');

appContainer.id = 'app';

document.body.append(appContainer);

const app = createApp(App).use(router);

// const pinia = createPinia();

app.use(pinia);

app.mount('#app');
