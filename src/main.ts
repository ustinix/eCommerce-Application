import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { theme } from './theme-vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import App from './app.vue';
import './style.scss';
import router from './router/router';
import pinia from './stores/pinia';

const appContainer = document.createElement('div');

const vuetify = createVuetify({
  components,
  directives,
  theme,
});

appContainer.id = 'app';

document.body.append(appContainer);

const app = createApp(App).use(router);

app.use(pinia);
app.use(vuetify);
app.mount('#app');
