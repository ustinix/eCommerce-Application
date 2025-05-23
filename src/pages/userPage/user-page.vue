<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';

const title = 'User profile';

const authStore = useAuthStore();

if (!authStore.isAuthenticated) {
  router.push('/');
}
onMounted(async () => {
  if (!authStore.currentApiRoot) return;
  const response = await authStore.currentApiRoot.me().get().execute();
  console.log(response);
});
</script>

<template>
  <div class="profile">
    <h2 class="profile_title">{{ title }}</h2>
  </div>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
</style>
