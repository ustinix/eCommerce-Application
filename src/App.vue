<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './components/layout/header.vue';
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
