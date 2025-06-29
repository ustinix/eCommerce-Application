<script setup lang="ts">
import DividerLine from '../ui/divider-line.vue';
import Logo from '../ui/logo.vue';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import { useCartStore } from '../../stores/cart';
import { AppNames } from '../../enums/app-names';
import { Pages } from '../../enums/pages';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const authStore = useAuthStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const cartCount = computed(() => cartStore.totalItems);

const navLinks = computed(() => [
  { to: '/', text: Pages.Home, show: true },
  { to: '/catalog', text: Pages.Catalog, show: true },
  { to: '/about', text: Pages.About, show: true },
  { to: '/login', text: Pages.Login, show: !authStore.isAuthenticated },
  { to: '/register', text: Pages.Registration, show: !authStore.isAuthenticated },
]);

function logout(): void {
  authStore.logOut();
  userStore.setUserProfile(null);
  cartStore.cart = null;
  cartStore.cartId = '';
}
</script>

<template>
  <div class="header" :class="{ 'theme-dark': isDark }">
    <div class="header-title">
      <div class="app-logo">
        <RouterLink to="/" title="Main" class="main-link">
          <Logo />
          <h2>{{ AppNames.Shop }}</h2>
        </RouterLink>
      </div>
      <div class="tools">
        <a href="#" target="_blank">
          <img src="../../assets/images/search.png" alt="search" width="15" height="15" />
        </a>
        <RouterLink to="/user" v-if="authStore.isAuthenticated" title="User profile">
          <img src="../../assets/images/user.png" alt="user" width="15" height="15" />
        </RouterLink>
        <RouterLink to="/cart" title="Cart" class="cart-link">
          <img
            src="../../assets/images/shopping-cart.png"
            alt="shopping-cart"
            width="15"
            height="15"
            class="cart-img"
          />
          <span class="cart-count" data-test="cart-counter" v-if="(cartCount ? cartCount : 0) > 0">
            {{ cartCount }}
          </span>
        </RouterLink>
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-title {
    padding-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tools {
      display: flex;
      justify-content: center;
      align-items: end;
      gap: 15px;
      img {
        filter: brightness(0);
        opacity: 0.8;
        transition: filter 0.3s ease;
      }
      .theme-dark & img {
        filter: invert(1) brightness(1.5);
      }
      .cart-link {
        position: relative;
        display: inline-block;

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: v.$color-red;
          color: v.$color-white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .main-link {
      display: flex;
      justify-content: center;
      gap: 1vh;
      cursor: pointer;
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
      color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.router-link-active {
        font-weight: bold;
        color: rgb(var(--v-theme-primary));
      }
    }
  }
  .header_button {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font: inherit;
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
