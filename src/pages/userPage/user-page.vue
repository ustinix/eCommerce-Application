<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import { getUserData } from '../../services/user-service';
import type { Customer } from '@commercetools/platform-sdk';
import UserView from '../../components/layout/user-view.vue';

const enum textPage {
  title = 'User profile',
  sectionPersonal = 'Personal information',
  sectionAddresses = 'Addresses',
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
  editButton = 'Edit',
  saveButton = 'Save',
  cancelButton = 'Cancel',
  errorLoading = 'Error loading user data',
}

const authStore = useAuthStore();
let isEditing = ref(false);
let profile = ref<Customer | null>(null);
let errorPage = ref<string | null>(null);

if (!authStore.isAuthenticated) {
  router.push('/');
}
onMounted(async () => {
  try {
    profile.value = await getUserData(authStore);
    errorPage.value = profile.value ? null : textPage.errorLoading;
  } catch {
    errorPage.value = textPage.errorLoading;
  }
});
const toggleEdit = (): void => {
  isEditing.value = !isEditing.value;
};
</script>

<template>
  <div class="hero-user">
    <h2 class="hero_title">{{ textPage.title }}</h2>
  </div>
  <p v-if="errorPage" class="error_text">{{ errorPage }}</p>
  <div class="profile" v-if="profile">
    <div v-if="!isEditing">
      <UserView :profile="profile" v-if="!isEditing" />
      <button class="button" @click="toggleEdit">{{ textPage.editButton }}</button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
.hero-user {
  @include hero-section('../../assets/images/profile.png');
}
</style>
