<script setup lang="ts">
import DividerLine from '../ui/dividerLine.vue';
import Logo from '../ui/logo.vue';
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
      <RouterLink to="/register">Registration</RouterLink>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';

.header {
  padding: 2rem;
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
        color: $color-red;
      }
    }
  }

  .nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    a {
      color: $color-black;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.router-link-active {
        font-weight: bold;
        color: $color-red;
      }
    }
  }
}
</style>
