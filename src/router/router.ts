import type { RouteRecordRaw } from 'vue-router';
import { createWebHistory, createRouter } from 'vue-router';
import MainPage from '../pages/mainPage/main-page.vue';
import RegistrationPage from '../pages/registrationPage/registration-page.vue';
import LoginPage from '../pages/loginPage/login-page.vue';
import ErrorPage from '../pages/errorPage/error-page.vue';
import CatalogPage from '../pages/catalogProductPage/catalog-page.vue';
import AboutPage from '../pages/aboutUsPage/about-page.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: MainPage },
  { path: '/catalog', component: CatalogPage },
  { path: '/about', component: AboutPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegistrationPage },
  { path: '/:pathMatch(.*)*', component: ErrorPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
