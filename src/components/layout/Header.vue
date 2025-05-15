<script setup lang="ts">
import DividerLine from '../ui/divider-line.vue';
import Logo from '../ui/logo.vue';
import { useAuthStore } from '../../stores/auth';
import { anonymApiRoot } from '../../services/auth-service';

const authStore = useAuthStore();

function logout(): void {
  authStore.setAuth(false);
  authStore.setApiRoot(anonymApiRoot);
}
</script>

<template>
  <div class="header">
    <div class="header-title">
      <div class="icons">
        <a href="https://github.com/ustinix" target="_blank">
          <img src="../../assets/images/Github-Logo.png" alt="Githab" width="40" height="20" />
        </a>
        <a href="https://github.com/AlexOlga" target="_blank">
          <img src="../../assets/images/Github-Logo.png" alt="Githab" width="40" height="20" />
        </a>
        <a href="https://rs.school/js/" target="_blank">
          <img
            src="../../assets/images/rs_school_js.svg"
            alt="RS-school course"
            width="40"
            height="20"
          />
        </a>
      </div>
      <div class="app-logo">
        <Logo />
        <h2>BEST SHOP</h2>
      </div>
      <div class="tools">
        <a href="#" target="_blank">
          <img src="../../assets/images/search.png" alt="search" width="15" height="15" />
        </a>
        <a href="#" target="_blank">
          <img src="../../assets/images/user.png" alt="user" width="15" height="15" />
        </a>
        <a href="#" target="_blank">
          <img
            src="../../assets/images/shopping-cart.png"
            alt="shopping-cart"
            width="15"
            height="15"
          />
        </a>
      </div>
    </div>
    <DividerLine />
    <nav class="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalog">Catalog</RouterLink>
      <RouterLink to="/about">About us</RouterLink>
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

    .icons {
      width: 10vw;
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 3vw;
    }
    .tools {
      width: 10vw;
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 3vw;
    }

    .app-logo {
      display: flex;
      justify-content: center;
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
    gap: 5vw;
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
@media (max-width: 500px) {
  .header {
    padding-top: 1rem;

    &-title {
      padding-bottom: 1rem;
      flex-direction: column;
      gap: 2vh;
    }
    .icons {
      display: none;
    }
    .tools {
      width: 100%;
      gap: 5vw;
    }
    .app-logo {
      order: -1;
    }
  }
}
</style>
