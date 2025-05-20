<script setup lang="ts">
const titlePage = 'Catalog page';
const textPage = 'catalog';
</script>

<template>
  <div class="catalog-page">
    <h1>{{ titlePage }}</h1>
    <p>{{ textPage }}</p>
  </div>
</template>

<style lang="scss" scoped>
.catalog-page {
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  text-align: center;
}
</style>
