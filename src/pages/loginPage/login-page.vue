<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import loginForm from '../../components/layout/login-form.vue';
const title = 'My Account';

const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  router.push('/');
}
</script>

<template>
  <div class="hero">
    <h2 class="hero_title">{{ title }}</h2>
  </div>
  <loginForm />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

.hero {
  background: url('../../assets/images/hero.png') no-repeat center center;
  background-size: auto 100%;
  width: 100%;
  height: 229px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero_title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 50px;
  line-height: 100%;
  letter-spacing: 0%;
  color: v.$color-white;
  text-align: center;
  @media (max-width: 500px) {
    font-size: 25px;
  }
}
</style>
