<script setup lang="ts">
import DividerLine from '../ui/divider-line.vue';
import Logo from '../ui/logo.vue';
import { useAuthStore } from '../../stores/auth';
import { createAnonymClient } from '../../services/anonym-client';
import { AppNames } from '../../assets/constants';
import { Pages } from '../../assets/constants';
import { computed } from 'vue';

const authStore = useAuthStore();

const navLinks = computed(() => [
  { to: '/', text: Pages.Home, show: true },
  { to: '/catalog', text: Pages.Catalog, show: true },
  { to: '/about', text: Pages.About, show: true },
  { to: '/login', text: Pages.Login, show: !authStore.isAuthenticated },
  { to: '/register', text: Pages.Registration, show: !authStore.isAuthenticated },
]);

function logout(): void {
  authStore.setAuth(false);
  authStore.setUser(null);
  authStore.setApiRoot(null);
  const anonymApiRoot = createAnonymClient();
  authStore.setApiRoot(anonymApiRoot);
}
</script>

<template>
  <div class="header">
    <div class="header-title">
      <div class="app-logo">
        <Logo />
        <h2>{{ AppNames.Shop }}</h2>
      </div>
      <div class="tools">
        <a href="#" target="_blank">
          <img src="../../assets/images/search.png" alt="search" width="15" height="15" />
        </a>
        <RouterLink to="/user" v-if="authStore.isAuthenticated" title="User profile">
          <img src="../../assets/images/user.png" alt="user" width="15" height="15" />
        </RouterLink>
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
      <RouterLink v-for="link in navLinks.filter(l => l.show)" :key="link.to" :to="link.to">
        {{ link.text }}
      </RouterLink>

      <button v-if="authStore.isAuthenticated" @click="logout" class="header_button">
        {{ Pages.Logout }}
      </button>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

.header {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-title {
    padding-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icons {
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 15px;
    }
    .tools {
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 15px;
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
      gap: 2vw;
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
