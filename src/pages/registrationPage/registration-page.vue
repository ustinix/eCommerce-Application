<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../../components/layout/base-input.vue';
import AddressForm from '../../components/layout/address-form.vue';
import { useAuthStore } from '../../stores/auth';
import { createCustomer } from '../../services/register-service';
import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { type Address } from '../../types/address';
import {
  countryCityList,
  Errors,
  userData,
  shippingAddress,
  billingAddress,
} from '../../assets/constants';
import { loginCustomer } from '../../services/auth-service';
import { validateName } from '../../utils/validate-name';
import { validateSurame } from '../../utils/validate-surname';
import { usePostalCodeValidation } from '../../utils/validate-postal-code';
import { validateDate } from '../../utils/validate-date';
import { validateEmail } from '../../utils/validate-email';
import { validatePassword } from '../../utils/validate-password';
import { SetAddress, Labels, Placeholders } from '../../assets/constants';

const disabled = defineModel<boolean>('disabled', { default: false });
const { validateCode } = usePostalCodeValidation(disabled);

const authStore = useAuthStore();

const router = useRouter();

if (authStore.isAuthenticated) {
  router.push('/');
}

const useSameAddress = ref<boolean>(false);
const defaultAddress = ref<boolean>(false);

const isSubmitting = ref<boolean>(false);

const createdCustomer = ref<CustomerSignInResult | null>(null);

function addSameAddress(): void {
  billingAddress.value = useSameAddress.value
    ? {
        country: shippingAddress.value.country,
        city: shippingAddress.value.city,
        streetName: shippingAddress.value.streetName,
        postalCode: shippingAddress.value.postalCode,
      }
    : { country: '', city: '', streetName: '', postalCode: '' };
}

watch(useSameAddress, sameAddress => {
  if (sameAddress) {
    addSameAddress();
  }
});

watch(
  shippingAddress,
  newShipping => {
    if (useSameAddress.value) {
      billingAddress.value = { ...newShipping };
    }
  },
  { deep: true },
);

function isButtonDisabled(): boolean {
  const { firstName, surname, email, password, date } = userData.value;
  const {
    country: sCountry,
    city: sCity,
    streetName: sStreet,
    postalCode: sCode,
  } = shippingAddress.value;

  const requiredFields = [
    firstName,
    surname,
    email,
    password,
    date,
    sCountry,
    sCity,
    sStreet,
    sCode,
  ];

  if (!useSameAddress.value) {
    const {
      country: bCountry,
      city: bCity,
      streetName: bStreet,
      postalCode: bCode,
    } = billingAddress.value;
    requiredFields.push(bCountry, bCity, bStreet, bCode);
  }

  return requiredFields.some(field => !field?.trim());
}

async function registration(event: Event): Promise<void> {
  event.preventDefault();
  authStore.setError(null);
  createdCustomer.value = null;
  isSubmitting.value = true;

  try {
    const addresses = [createAddress(shippingAddress.value)];
    if (!useSameAddress.value) {
      addresses.push(createAddress(billingAddress.value));
    }
    const result = await createCustomer(
      userData.value.firstName,
      userData.value.surname,
      userData.value.email,
      userData.value.password,
      userData.value.date,
      addresses,
      authStore,
      defaultAddress.value ? 0 : undefined,
      getDefaultBillingAddress(defaultAddress.value, useSameAddress.value),
    );

    createdCustomer.value = result;
    await handleAutoLogin();
  } catch (error) {
    handleRegistrationError(error);
  } finally {
    isSubmitting.value = false;
  }
}

function createAddress(address: typeof shippingAddress.value): Address {
  const countryCode = countryCityList[address.country]?.isoCode || address.country;
  return {
    country: countryCode,
    city: address.city,
    streetName: address.streetName,
    postalCode: address.postalCode,
  };
}

function getDefaultBillingAddress(isDefault: boolean, isSameAddress: boolean): number | undefined {
  return isDefault ? (isSameAddress ? 0 : 1) : undefined;
}

async function handleAutoLogin(): Promise<void> {
  try {
    await loginCustomer(
      userData.value.email,
      userData.value.password,
      () => {
        authStore.setUser(userData.value.email);
        authStore.setAuth(true);
        router.push('/');
      },
      () => {
        authStore.setError(Errors.AutoLogin);
        router.push('/login');
      },
    );
  } catch {
    authStore.setError(Errors.AutoLogin);
    router.push('/login');
  }
}

function handleRegistrationError(error: unknown): void {
  if (authStore.errorAuth) return;

  if (error instanceof Error && error.message.includes('existing customer')) {
    authStore.setError(Errors.AccountExist);
    globalThis.setTimeout(() => router.push('/login'), 3000);
  } else {
    authStore.setError(Errors.Registration);
  }
}
</script>

<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <div class="forms">
      <form>
        <BaseInput
          data-test="name-input"
          v-model="userData.firstName"
          :label="Labels.labelName"
          :placeholder="Placeholders.placeholderName"
          required
          type="text"
          :validate="validateName"
        />
        <BaseInput
          data-test="surname-input"
          v-model="userData.surname"
          :label="Labels.labelSurname"
          :placeholder="Placeholders.placeholderSurname"
          required
          type="text"
          :validate="validateSurame"
        />
        <BaseInput
          v-model="userData.email"
          :label="Labels.labelEmail"
          :placeholder="Placeholders.placeholderEmail"
          required
          type="email"
          :validate="validateEmail"
        />
        <BaseInput
          v-model="userData.password"
          :label="Labels.labelPassword"
          :placeholder="Placeholders.placeholderPassword"
          required
          type="password"
          :validate="validatePassword"
        />
        <BaseInput
          data-test="date-input"
          v-model="userData.date"
          :label="Labels.labelDate"
          required
          type="date"
          :validate="validateDate"
        />
      </form>
      <form class="shipping">
        <h3>Shipping address:</h3>
        <AddressForm
          label="Country"
          placeholder="Country"
          v-model="shippingAddress.country"
          fieldType="country"
          :selectedCountry="shippingAddress.country"
          :disabled="false"
        />
        <AddressForm
          label="City"
          placeholder="City"
          v-model="shippingAddress.city"
          fieldType="city"
          :selectedCountry="shippingAddress.country"
          :disabled="!shippingAddress.country"
        />
        <AddressForm
          label="Street"
          placeholder="Street"
          v-model="shippingAddress.streetName"
          fieldType="street"
          :disabled="false"
        />
        <BaseInput
          data-test="PostalCode-input"
          v-model="shippingAddress.postalCode"
          :label="Labels.labelCode"
          :placeholder="Placeholders.placeholderCode"
          required
          type="text"
          :validate="validateCode"
          :readonly="disabled"
        />
        <div class="chkBoxWrapper">
          <a class="chkBoxText">{{ SetAddress.Same }}</a>
          <input type="checkbox" class="chkBox" v-model="useSameAddress" @change="addSameAddress" />
        </div>
        <div class="chkBoxWrapper">
          <a class="chkBoxText">{{ SetAddress.DefaultShipping }}</a>
          <input type="checkbox" class="chkBox" v-model="defaultAddress" />
        </div>
      </form>
      <form class="billing">
        <h3>Billing address:</h3>
        <AddressForm
          label="Country"
          placeholder="Country"
          v-model="billingAddress.country"
          fieldType="country"
          :selectedCountry="useSameAddress ? shippingAddress.country : billingAddress.country"
          :disabled="useSameAddress"
        />
        <AddressForm
          label="City"
          placeholder="City"
          v-model="billingAddress.city"
          fieldType="city"
          :selectedCountry="billingAddress.country"
          :disabled="useSameAddress"
        />
        <AddressForm
          label="Street"
          placeholder="Street"
          v-model="billingAddress.streetName"
          fieldType="street"
          :disabled="useSameAddress"
        />
        <BaseInput
          data-test="billingPostalCode-input"
          v-model="billingAddress.postalCode"
          :label="Labels.labelCode"
          :placeholder="Placeholders.placeholderCode"
          required
          type="text"
          :validate="validateCode"
          :readonly="disabled"
        />
        <div class="chkBoxWrapper">
          <a class="chkBoxText">{{ SetAddress.DefaultBilling }}</a>
          <input type="checkbox" class="chkBox" v-model="defaultAddress" />
        </div>
      </form>
    </div>
    <button
      v-if="!createdCustomer"
      type="submit"
      @click="registration"
      class="button form_button"
      :disabled="isButtonDisabled()"
    >
      {{ isSubmitting ? 'Processing...' : 'REGISTER' }}
    </button>
    <p v-if="authStore.errorAuth" class="server_error">{{ authStore.errorAuth }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
@use '../../assets/styles/form.scss';

.registration-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .forms {
    display: flex;
    justify-content: center;
    gap: 6vh;
    padding-bottom: 2vh;
  }

  h1 {
    padding-bottom: 5vh;
  }

  form {
    width: 25vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    h3 {
      margin: 0;
      padding: 0 0 3vh 0;
    }

    .chkBoxWrapper {
      padding: 1vh;
      display: flex;
      justify-content: space-between;
      .chkBoxText {
        font-size: 15px;
        color: v.$color-grey;
      }

      .chkBox {
        width: 2vh;
        padding: 0;
        margin: 0;
      }
    }
  }
}

.button {
  background-color: v.$color-red;
  color: v.$color-white;
  display: block;
  width: 50%;
  margin: 10px 0;
  padding: 8px;
}

.server_error {
  color: v.$color-red;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .registration-page {
    .forms {
      flex-direction: column;
    }
    form {
      width: 80vw;
    }
  }
}
</style>
