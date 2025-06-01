<script setup lang="ts">
import { defineProps, reactive } from 'vue';
import type { EditAddressProps } from '../../types/address';
import { usePostalCodeValidation } from '../../utils/validate-postal-code';
import { createActionsChangeAddress } from '../../utils/create-actions';
import { Labels, SetAddress, Placeholders } from '../../assets/constants';
import AddressForm from './address-form.vue';
import BaseInput from './base-input.vue';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { updateUserAddressData } from '../../services/user-service';

const userStore = useUserStore();
const authStore = useAuthStore();

const props = defineProps<EditAddressProps & { close: () => void }>();
const startAddress = {
  id: props.id,
  country: props.country === 'RU' ? 'Russia' : 'United States',
  city: props.city || '',
  streetName: props.streetName || '',
  postalCode: props.postalCode || '',
  defaultShipping: props.defaultShipping,
  defaultBilling: props.defaultBilling,
};
const newAddress = reactive(startAddress);

const enum textComponent {
  labelsCountry = 'Country',
  labelCity = 'City',
  labelStreet = 'Street',
  saveButton = 'Save',
}
const disabled = defineModel<boolean>('disabled', { default: false });
const { validateCode } = usePostalCodeValidation(disabled);
async function updateAddress(): Promise<void> {
  if (userStore.profile === null) return;
  newAddress.country = newAddress.country === 'Russia' ? 'RU' : 'US';
  const actions = createActionsChangeAddress(newAddress, userStore.profile);
  await updateUserAddressData(userStore, authStore, actions);
  props.close();
}
</script>
<template>
  <form>
    <AddressForm
      :label="textComponent.labelsCountry"
      :placeholder="textComponent.labelsCountry"
      v-model="newAddress.country"
      fieldType="country"
      :selectedCountry="newAddress.country"
      :disabled="false"
    />
    <AddressForm
      :label="textComponent.labelCity"
      :placeholder="textComponent.labelCity"
      v-model="newAddress.city"
      fieldType="city"
      :selectedCountry="newAddress.country"
      :disabled="!newAddress.country"
    />
    <AddressForm
      :label="textComponent.labelStreet"
      :placeholder="textComponent.labelStreet"
      v-model="newAddress.streetName"
      fieldType="street"
      :disabled="false"
    />
    <BaseInput
      data-test="PostalCode-input"
      v-model="newAddress.postalCode"
      :label="Labels.labelCode"
      :placeholder="Placeholders.placeholderCode"
      required
      type="text"
      :validate="validateCode"
      :readonly="disabled"
    />
    <div class="chkBoxWrapper">
      <label class="chkBoxText">{{ SetAddress.DefaultShipping }}</label>
      <input type="checkbox" class="chkBox" v-model="newAddress.defaultShipping" />
    </div>
    <div class="chkBoxWrapper">
      <label class="chkBoxText">{{ SetAddress.DefaultBilling }}</label>
      <input type="checkbox" class="chkBox" v-model="newAddress.defaultBilling" />
    </div>
    <button class="button" @click.prevent="updateAddress">{{ textComponent.saveButton }}</button>
  </form>
</template>

<style lang="scss" scoped></style>
