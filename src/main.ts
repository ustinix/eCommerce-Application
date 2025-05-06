import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
const appContainer = document.createElement('div');
appContainer.id = 'app';
document.body.appendChild(appContainer);
createApp(App).mount('#app');
