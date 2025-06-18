<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './components/layout/header.vue';
import Footer from './components/layout/footer.vue';
import { useTheme } from 'vuetify';
import { onMounted } from 'vue';

const theme = useTheme();

onMounted(() => {
  const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', event => {
    theme.global.name.value = event.matches ? 'appThemeDark' : 'appTheme';
  });
});
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
