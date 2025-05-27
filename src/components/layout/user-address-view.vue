<script setup lang="ts">
import type { AddressWithId } from '../../types/address';
import type { UserProfile } from '../../types/user-profile';

const enum componentPage {
  defaultShipping = 'Default Shipping Address',
  defaultBilling = 'Default Billing Address',
}

const { profile } = defineProps<{
  profile: UserProfile;
}>();
const isDefaultBilling = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultBillingAddressId;
const isDefaultShipping = (address: AddressWithId): boolean =>
  address.id !== undefined && address.id === profile.defaultShippingAddressId;
</script>
<template v-if="profile">
  <div v-for="address in profile.addresses" :key="address.id">
    <p>
      {{ address.streetName }}, {{ address.city }}, {{ address.postalCode }},
      {{ address.country }}
    </p>
    <p v-if="isDefaultShipping(address)">{{ componentPage.defaultShipping }}</p>
    <p v-if="isDefaultBilling(address)">{{ componentPage.defaultBilling }}</p>
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
