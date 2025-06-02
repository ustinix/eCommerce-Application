<script setup lang="ts">
import { defineProps, reactive } from 'vue';
import type { EditAddressProps } from '../../types/address';
import { usePostalCodeValidation } from '../../utils/validate-postal-code';
import { createActionsChangeAddress, createActionsAddAddress } from '../../utils/create-actions';
import { Labels, SetAddress, Placeholders } from '../../assets/constants';
import AddressForm from './address-form.vue';
import BaseInput from './base-input.vue';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { updateUserAddressData } from '../../services/user-service';
import { normalizeCountry } from '../../utils/normalize-country';

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
  cancelButton = 'Cancel',
}
const disabled = defineModel<boolean>('disabled', { default: false });
const { validateCode } = usePostalCodeValidation(disabled);

async function updateAddress(): Promise<void> {
  if (userStore.profile === null) return;
  newAddress.country = normalizeCountry(newAddress.country);
  if (newAddress.id === undefined) {
    handleNewAddress();
  } else {
    await updateDataAddress();
  }

  props.close();
}
function isButtonDisabled(): boolean {
  const { country, city, streetName, postalCode } = newAddress;
  const requiredFields = [country, city, streetName, postalCode];
  return requiredFields.some(field => !field?.trim());
}
async function handleNewAddress(): Promise<void> {
  const addActions = createActionsAddAddress(newAddress);
  await updateUserAddressData(userStore, authStore, addActions);

  if (newAddress.defaultBilling || newAddress.defaultShipping) {
    const newId = getLastAddressId();
    if (newId) {
      newAddress.id = newId;
      await updateDataAddress();
    }
  }
}
function getLastAddressId(): string | undefined {
  if (userStore.profile !== null) {
    const addresses = userStore.profile.addresses;
    return addresses.at(-1)?.id;
  }
}
async function updateDataAddress(): Promise<void> {
  const updateActions = createActionsChangeAddress(newAddress, userStore.profile!);
  await updateUserAddressData(userStore, authStore, updateActions);
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
    <div>
      <button class="button" @click.prevent="updateAddress" :disabled="isButtonDisabled()">
        {{ textComponent.saveButton }}
      </button>
      <button class="button" @click.prevent="close">{{ textComponent.cancelButton }}</button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
