<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import type { AddressWithId, EditAddressProps } from '../../types/address';
import type { UserProfile } from '../../types/user-profile';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import editAddress from './edit-address.vue';
import Modal from './modal.vue';
import { updateUserAddressData } from '../../services/user-service';
import { crateActionsDeleteAddress } from '../../utils/create-actions';

const snackbarStore = useSnackbarStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const enum componentPage {
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
  deleteButton = 'Delete',
  editButton = 'Edit',
  errorAddressDelete = 'Failed to delete address. Try again later.',
  successAddressDelete = 'Address successfully deleted',
}

const { profile } = defineProps<{
  profile: UserProfile;
}>();
const isModalOpen = ref(false);
const modalComponent = shallowRef();
const modalProps = ref<EditAddressProps>();
const isDefaultBilling = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultBillingAddressId;
const isDefaultShipping = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultShippingAddressId;

function openModal(address: AddressWithId): void {
  modalComponent.value = editAddress;
  modalProps.value = {
    ...address,
    defaultShipping: isDefaultShipping(address),
    defaultBilling: isDefaultBilling(address),
  } satisfies EditAddressProps;
  isModalOpen.value = true;
}
async function deleteAddress(address: AddressWithId): Promise<void> {
  if (userStore.profile === null) return;
  const actions = crateActionsDeleteAddress(address, userStore.profile);
  try {
    await updateUserAddressData(userStore, authStore, actions);
    snackbarStore.success(componentPage.successAddressDelete);
  } catch {
    snackbarStore.success(componentPage.errorAddressDelete);
  }
}
</script>
<template v-if="profile">
  <div
    v-for="address in profile.addresses"
    :key="address.id"
    class="address-item"
    :class="{ 'default-class': isDefaultShipping(address) || isDefaultBilling(address) }"
  >
    <p>
      {{ address.streetName }}, {{ address.city }}, {{ address.postalCode }},
      {{ address.country }}
    </p>
    <p v-if="isDefaultShipping(address)" class="subtext">{{ componentPage.defaultShipping }}</p>
    <p v-if="isDefaultBilling(address)" class="subtext">{{ componentPage.defaultBilling }}</p>
    <div class="buttons">
      <button class="button" @click="openModal(address)">
        {{ componentPage.editButton }}
      </button>
      <button class="button" @click="deleteAddress(address)">
        {{ componentPage.deleteButton }}
      </button>
    </div>
    <Modal v-model="isModalOpen" :component="modalComponent" :componentProps="modalProps ?? {}" />
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
.buttons {
  display: flex;
  gap: 10px;
  padding: 10px;
}
.address-item {
  padding: 10px;
  margin-bottom: 10px;
}
.subtext {
  text-align: right;
  font-size: 8px;
  margin-top: 10px;
}
.default-class {
  background-color: rgba(v.$color-selected, 0.5);
  border-radius: 20px;
}
</style>
