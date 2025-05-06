<script setup lang="ts"></script>

<template>
  <div class="header">
    <div class="header-title">
      <div class="icons"></div>
      <h1>BEST SHOP</h1>
      <div class="tools"></div>
    </div>
    <nav class="nav">
      <RouterLink to="/">main page</RouterLink>
      <RouterLink to="/register">registration</RouterLink>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      color: #f22735;
    }
  }

  .nav {
    display: flex;
    gap: 1rem;
    padding-top: 20px;

    a {
      color: #333;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.router-link-active {
        font-weight: bold;
        color: #f22735;
      }
    }
  }
}
</style>
