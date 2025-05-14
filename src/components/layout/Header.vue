<script setup lang="ts">
import DividerLine from '../ui/divider-line.vue';
import Logo from '../ui/logo.vue';
import { useAuthStore } from '../../stores/auth';
import { anonymApiRoot } from '../../services/auth-service.ts';

const authStore = useAuthStore();

function logout(): void {
  authStore.setAuth(false);
  authStore.setApiRoot(anonymApiRoot);
}
</script>

<template>
  <div class="header">
    <div class="header-title">
      <div class="icons"></div>
      <div class="app-logo">
        <Logo />
        <h2>BEST SHOP</h2>
      </div>
      <div class="tools"></div>
    </div>
    <DividerLine />
    <nav class="nav">
      <RouterLink to="/">Main page</RouterLink>
      <RouterLink to="/login" v-if="!authStore.isAuthenticated">Login</RouterLink>
      <RouterLink to="/register" v-if="!authStore.isAuthenticated">Registration</RouterLink>
      <button @click="logout" v-if="authStore.isAuthenticated" class="header_button">Logout</button>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

.header {
  padding-top: 2rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-title {
    padding-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .app-logo {
      display: flex;
      gap: 1vh;

      h2 {
        margin: 0;
        color: v.$color-red;
      }
    }
  }

  .nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    a {
      color: v.$color-black;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.router-link-active {
        font-weight: bold;
        color: v.$color-red;
      }
    }
  }
}
</style>
