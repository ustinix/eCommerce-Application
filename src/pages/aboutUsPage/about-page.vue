<script setup lang="ts">
const titlePage = 'About page';
const textPage = 'about';
</script>

<template>
  <div class="about-page">
    <h1>{{ titlePage }}</h1>
    <p>{{ textPage }}</p>
  </div>
</template>

<style lang="scss" scoped>
.about-page {
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  text-align: center;
}
</style>
