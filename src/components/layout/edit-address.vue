<script setup lang="ts">
import { defineProps, reactive } from 'vue';
import type { EditAddressProps } from '../../types/address';
import { usePostalCodeValidation } from '../../utils/validate-postal-code';
import { createActionsChangeAddress, createActionsAddAddress } from '../../utils/create-actions';
import { Placeholders } from '../../enums/placeholders';
import { Labels } from '../../enums/labels';
import { SetAddress } from '../../enums/set-address';
import AddressForm from './address-form.vue';
import BaseInput from './base-input.vue';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import { updateUserAddressData } from '../../services/user-service';
import { getCountryCode, getCountryName } from '../../utils/code-country';

const userStore = useUserStore();
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();

const props = defineProps<EditAddressProps & { close: () => void }>();
const startAddress = {
  id: props.id,
  country: getCountryName(props.country || ''),
  city: props.city || '',
  streetName: props.streetName || '',
  postalCode: props.postalCode || '',
  defaultShipping: props.defaultShipping,
  defaultBilling: props.defaultBilling,
};
const newAddress = reactive(startAddress);

const textComponent = {
  labelsCountry: 'Country',
  labelCity: 'City',
  labelStreet: 'Street',
  saveButton: 'Save',
  cancelButton: 'Cancel',
  errorAddress: 'Failed to update address. Try again later',
  successAddress: 'Address updated successfully',
};
const disabled = defineModel<boolean>('disabled', { default: false });
const { validateCode } = usePostalCodeValidation(disabled);

async function updateAddress(): Promise<void> {
  if (userStore.profile === null) return;
  newAddress.country = getCountryCode(newAddress.country);
  try {
    await (newAddress.id === undefined ? handleNewAddress() : updateDataAddress());
    snackbarStore.success(textComponent.successAddress);
  } catch {
    snackbarStore.success(textComponent.errorAddress);
  } finally {
    props.close();
  }
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
    <div class="buttons">
      <button class="button" @click.prevent="updateAddress" :disabled="isButtonDisabled()">
        {{ textComponent.saveButton }}
      </button>
      <button class="button" @click.prevent="close">{{ textComponent.cancelButton }}</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.buttons {
  display: flex;
  gap: 10px;
}
.chkBox {
  padding: 3px;
}
</style>
