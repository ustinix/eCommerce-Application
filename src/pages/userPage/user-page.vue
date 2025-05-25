<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import router from '../../router/router';
import { getUserData } from '../../services/user-service';
import UserView from '../../components/layout/user-view.vue';
import UserEdit from '../../components/layout/user-edit.vue';

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
const userStore = useUserStore();

let isEditing = ref(false);
let errorPage = ref<string | null>(null);

if (!authStore.isAuthenticated) {
  router.push('/');
}
onMounted(async () => {
  try {
    const profile = await getUserData(authStore);
    errorPage.value = profile ? null : textPage.errorLoading;
    userStore.setUserProfile(profile);
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
  <div class="profile" v-else>
    <div v-if="!isEditing">
      <UserView v-if="userStore.profile" :profile="userStore.profile" />
      <button class="button" @click="toggleEdit">{{ textPage.editButton }}</button>
    </div>
    <div v-if="isEditing">
      <UserEdit v-if="userStore.profile" :profile="userStore.profile" />
      <div class="buttons">
        <button class="button">{{ textPage.saveButton }}</button>
        <button class="button">{{ textPage.cancelButton }}</button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
.hero-user {
  @include hero-section('../../assets/images/profile.png');
}
</style>
