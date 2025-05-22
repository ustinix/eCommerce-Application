<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const titlePage = '404 page';
const textPage = 'This page not found.';
const buttonText = 'Back to home page';

function toMainPage(): void {
  router.push('/');
}
</script>

<template>
  <div class="error-page">
    <h1>{{ titlePage }}</h1>
    <p>{{ textPage }}</p>
    <button type="submit" @click="toMainPage" class="button">{{ buttonText }}</button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.error-page {
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 3vh;
  align-items: center;
  .button {
    background-color: v.$color-red;
    color: #fff;
    display: block;
    width: 20%;
    margin: 10px 0;
    padding: 8px;
  }
}
</style>
