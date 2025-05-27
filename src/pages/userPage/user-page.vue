<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import router from '../../router/router';
import { getUserData } from '../../services/user-service';
import UserView from '../../components/layout/user-view.vue';
import UserEdit from '../../components/layout/user-edit.vue';
import UserAddressView from '../../components/layout/user-address-view.vue';
import ChangePassword from '../../components/layout/change-password.vue';

const enum textPage {
  title = 'User profile',
  sectionPersonal = 'Personal information',
  sectionAddresses = 'Addresses',
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
  editButton = 'Edit',
  errorLoading = 'Error loading user data',
  password = 'Change password',
}

const authStore = useAuthStore();
const userStore = useUserStore();

let isEditPersonal = ref(false);
let isEditAddress = ref(false);
let isEditPassword = ref(false);
let errorPage = ref<string | null>(null);
watch(
  () => authStore.isAuthenticated,
  isAuth => {
    if (!isAuth) {
      router.push('/');
    }
  },
);

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
const toggleEditPersonal = (): void => {
  isEditPersonal.value = !isEditPersonal.value;
};
const toggleEditAddress = (): void => {
  isEditAddress.value = !isEditAddress.value;
};
const toggleEditPassword = (): void => {
  isEditPassword.value = !isEditPassword.value;
};
</script>

<template>
  <div class="hero-user">
    <h2 class="hero_title">{{ textPage.title }}</h2>
  </div>

  <p v-if="errorPage" class="error_text">{{ errorPage }}</p>

  <div class="profile" v-else>
    <section class="profile_section">
      <div class="section-header">
        <h3 class="title-small">{{ textPage.sectionPersonal }}</h3>
        <button class="button" v-if="!isEditPersonal" @click="toggleEditPersonal">
          {{ textPage.editButton }}
        </button>
      </div>
      <div v-if="userStore.profile">
        <UserView v-if="!isEditPersonal" :profile="userStore.profile" />
        <UserEdit v-else :profile="userStore.profile" :toggle="toggleEditPersonal" />
      </div>
    </section>
    <section class="profile_section">
      <button class="button" @click="toggleEditPassword" v-if="!isEditPassword">
        {{ textPage.password }}
      </button>
      <ChangePassword v-else :toggle="toggleEditPassword" />
    </section>
    <section class="profile_section">
      <div class="section-header">
        <h3 class="title-small">{{ textPage.sectionAddresses }}</h3>
        <button class="button" @click="toggleEditAddress" v-if="!isEditAddress">
          {{ textPage.editButton }}
        </button>
      </div>
      <div v-if="userStore.profile">
        <UserAddressView v-if="!isEditAddress" :profile="userStore.profile" />
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
.hero-user {
  @include hero-section('../../assets/images/profile.png');
}
.section-header {
  display: flex;
  justify-content: space-between;
}
</style>
