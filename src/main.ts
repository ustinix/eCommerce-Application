import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
// import { createPinia } from 'pinia';
import App from './app.vue';
import './style.scss';
import router from './router/router';
import pinia from './stores/pinia';

const appContainer = document.createElement('div');

const vuetify = createVuetify({
  components,
  directives,
});

appContainer.id = 'app';

document.body.append(appContainer);

const app = createApp(App).use(router);

// const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.mount('#app');
