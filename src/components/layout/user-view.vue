<script setup lang="ts">
import { Labels } from '../../assets/constants';
import type { AddressWithId } from '../../types/address';
import type { UserProfile } from '../../types/user-profile';
// import { useUserStore } from '../../stores/user';
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
/*const userStore = useUserStore();
const { profile } = userStore;*/
const { profile } = defineProps<{
  profile: UserProfile;
}>();
const isDefaultBilling = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultBillingAddressId;
const isDefaultShipping = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultShippingAddressId;
</script>
<template v-if="profile">
  <section class="profile_section">
    <h2 class="title-small">{{ textPage.sectionPersonal }}</h2>
    <p>
      <span class="label">{{ Labels.labelName }}</span> {{ profile.firstName }}
    </p>
    <p>
      <span class="label">{{ Labels.labelSurname }}</span> {{ profile.lastName }}
    </p>
    <p>
      <span class="label">{{ Labels.labelDate }}</span> {{ profile.dateOfBirth }}
    </p>
  </section>
  <section class="profile_section">
    <h2 class="title-small">{{ textPage.sectionAddresses }}</h2>
    <div v-for="address in profile.addresses" :key="address.id">
      <p>
        {{ address.streetName }}, {{ address.city }}, {{ address.postalCode }},
        {{ address.country }}
      </p>
      <p v-if="isDefaultShipping(address)">{{ textPage.defaultShipping }}</p>
      <p v-if="isDefaultBilling(address)">{{ textPage.defaultBilling }}</p>
    </div>
  </section>
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
