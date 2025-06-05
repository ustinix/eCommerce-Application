<script setup lang="ts">
import { onMounted, ref, watch, shallowRef } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import router from '../../router/router';
import { getUserData } from '../../services/user-service';
import UserView from '../../components/layout/user-view.vue';
import UserEdit from '../../components/layout/user-edit.vue';
import UserAddressView from '../../components/layout/user-address-view.vue';
import ChangePassword from '../../components/layout/change-password.vue';
import editAddress from '../../components/layout/edit-address.vue';
import Modal from '../../components/layout/modal.vue';
import Snackbar from '../../components/layout/snack-bar.vue';

const enum textPage {
  title = 'User profile',
  sectionPersonal = 'Personal information',
  sectionAddresses = 'Addresses',
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
  editButton = 'Edit',
  deleteButton = 'Delete',
  addButton = 'Add',
  errorLoading = 'Error loading user data',
  password = 'Change password',
}

const authStore = useAuthStore();
const userStore = useUserStore();

let isEditPersonal = ref(false);
let isEditAddress = ref(false);
let isEditPassword = ref(false);
let errorPage = ref<string | null>(null);
//
const startAddress = {
  country: '',
  city: '',
  streetName: '',
  postalCode: '',
  defaultShipping: false,
  defaultBilling: false,
};
const isModalOpen = ref(false);
const modalComponent = shallowRef();
const modalProps = ref(startAddress);
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

const toggleEditPassword = (): void => {
  isEditPassword.value = !isEditPassword.value;
};
function addAddress(): void {
  modalComponent.value = editAddress;
  isModalOpen.value = true;
}
</script>

<template>
  <div class="hero-user">
    <h2 class="hero_title">{{ textPage.title }}</h2>
  </div>

  <p v-if="errorPage" class="error_text">{{ errorPage }}</p>

  <div class="profile" v-else>
    <Snackbar />
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
    <section class="profile_section section_password">
      <button class="button" @click="toggleEditPassword" v-if="!isEditPassword">
        {{ textPage.password }}
      </button>
      <ChangePassword v-else :toggle="toggleEditPassword" />
    </section>
    <section class="profile_section">
      <div class="section-header">
        <h3 class="title-small">{{ textPage.sectionAddresses }}</h3>
        <button class="button" @click="addAddress">{{ textPage.addButton }}</button>
      </div>
      <div v-if="userStore.profile">
        <UserAddressView v-if="!isEditAddress" :profile="userStore.profile" />
      </div>
    </section>
  </div>
  <Modal v-model="isModalOpen" :component="modalComponent" :componentProps="modalProps ?? {}" />
</template>
<style lang="scss" scoped>
@use '../../assets/styles/hero.scss' as *;
@use '../../assets/styles/variables.scss' as v;

.hero-user {
  @include hero-section('../../assets/images/profile.png');
}
.section-header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.profile {
  max-width: 450px;
  margin: 20px auto;
}
.profile_section {
  text-align: left;
  padding: 20px;
  border-bottom: 1px solid v.$color-red;
}
.section_password {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
