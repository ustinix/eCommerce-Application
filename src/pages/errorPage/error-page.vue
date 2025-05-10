<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function toMainPage(): void {
  router.push('/');
}
</script>

<template>
  <div class="error-page">
    <h1>404 page</h1>
    <p>This page not found.</p>
    <button type="submit" @click="toMainPage" class="button">Back to main page</button>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #e7e8e9;
}
</style>
