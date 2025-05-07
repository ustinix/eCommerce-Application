import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.scss';
import router from './router/router';

const appContainer = document.createElement('div');

appContainer.id = 'app';

document.body.append(appContainer);

const pinia = createPinia();

const app = createApp(App).use(router);

app.mount('#app');
app.use(pinia);
