<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import { getUserData } from '../../services/user-service';

const title = 'User profile';

const authStore = useAuthStore();

if (!authStore.isAuthenticated) {
  router.push('/');
}
onMounted(async () => {
  await getUserData(authStore);
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
