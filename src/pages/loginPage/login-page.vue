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
  <div class="hero-login">
    <h2 class="hero_title">{{ title }}</h2>
  </div>
  <loginForm />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
.hero-login {
  @include hero-section('../../assets/images/hero.png');
}
</style>
