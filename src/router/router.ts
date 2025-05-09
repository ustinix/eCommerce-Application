import { createWebHistory, createRouter } from 'vue-router';

import MainPage from '../pages/mainPage/main-page.vue';
import RegistrationPage from '../pages/registrationPage/registration-page.vue';
import LoginPage from '../pages/loginPage/login-page.vue';

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
