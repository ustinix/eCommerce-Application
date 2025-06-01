<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import type { AddressWithId } from '../../types/address';
import type { UserProfile } from '../../types/user-profile';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import editAddress from './edit-address.vue';
import Modal from './modal.vue';
import { deleteUserProfile } from '../../services/user-service';

const userStore = useUserStore();
const authStore = useAuthStore();
const enum componentPage {
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
  deleteButton = 'Delete',
  editButton = 'Edit',
}

const { profile } = defineProps<{
  profile: UserProfile;
}>();
const isModalOpen = ref(false);
const modalComponent = shallowRef();
const modalProps = ref<AddressWithId>();
const isDefaultBilling = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultBillingAddressId;
const isDefaultShipping = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultShippingAddressId;

function openModal(address: AddressWithId): void {
  modalComponent.value = editAddress;
  modalProps.value = address;
  isModalOpen.value = true;
}
function deleteAddress(address: AddressWithId): void {
  deleteUserProfile(address, userStore, authStore);
  console.log('delete');
}
</script>
<template v-if="profile">
  <div v-for="address in profile.addresses" :key="address.id">
    <p>
      {{ address.streetName }}, {{ address.city }}, {{ address.postalCode }},
      {{ address.country }}
    </p>
    <p v-if="isDefaultShipping(address)">{{ componentPage.defaultShipping }}</p>
    <p v-if="isDefaultBilling(address)">{{ componentPage.defaultBilling }}</p>
    <div class="buttons">
      <button class="button" @click="openModal(address)">
        {{ componentPage.editButton }}
      </button>
      <button class="button" @click="deleteAddress(address)">
        {{ componentPage.deleteButton }}
      </button>
    </div>
    <Modal v-model="isModalOpen" :component="modalComponent" :componentProps="modalProps" />
  </div>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.profile_section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  text-align: left;
}
.title-small {
  font-weight: 700;
  font-size: 30px;
}
.label {
  font-weight: 600;
}
</style>
