import { createWebHistory, createRouter } from 'vue-router';

import mainPage from '../pages/mainPage/mainPage.vue';
import registrationPage from '../pages/registrationPage/registrationPage.vue';

const routes = [
  { path: '/', component: mainPage },
  { path: '/register', component: registrationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
