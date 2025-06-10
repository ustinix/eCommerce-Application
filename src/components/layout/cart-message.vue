<script setup lang="ts">
const textComponent = {
  text: 'Your cart is empty. ',
  link: 'Start shopping',
};
</script>

<template>
  <p class="message-container">
    {{ textComponent.text }} <RouterLink to="/catalog">{{ textComponent.link }}</RouterLink>
  </p>
</template>

<style lang="scss" scoped>
.message-container {
  padding: 100px;
  text-align: center;
  font-size: 2rem;
}
</style>
