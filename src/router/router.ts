import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '../pages/mainPage/mainPage.vue';
import RegistrationPage from '../pages/registrationPage/registrationPage.vue';
import LoginPage from '../pages/loginPage/LoginPage.vue';

const routes = [
  { path: '/', component: MainPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegistrationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
