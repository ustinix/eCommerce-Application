<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../../components/layout/base-input.vue';
import AddressForm from '../../components/layout/address-form.vue';
import { useAuthStore } from '../../stores/auth';
import { createCustomer } from '../../services/register-service';
import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { type Address } from '../../types/address';
import { countryCityList, Errors } from '../../assets/constants';
import { loginCustomer } from '../../services/auth-service';
import type { UserData } from '../../types/user-data';
import { isEmail } from '../../utils/is-email';
import { isPassword } from '../../utils/is-password';
import { validateName } from '../../utils/validate-name';
import { validateSurame } from '../../utils/validate-surname';
import { usePostalCodeValidation } from '../../utils/validate-postal-code';
import { validateDate } from '../../utils/validate-date';

const labelDate = 'Date';
const date = ref<string>('');

const disabled = defineModel<boolean>('disabled', { default: false });
const { validateCode } = usePostalCodeValidation(disabled);
const labelCode = 'Postal code';
const placeholderCode = 'Postal code';
const shippingPostalCode = ref('');
const billingPostalCode = ref('');

const labelSurname = 'Surname';
const placeholderSurname = 'Surname';
const surname = ref<string>('');

const labelName = 'First Name';
const placeholderName = 'First Name';
const name = ref<string>('');

const authStore = useAuthStore();

const labelEmail = 'Email address';
const placeholderEmail = 'Enter your email';
const labelPassword = 'Password';
const placeholderPassword = 'Password';

const email = ref<string>('');
const emailError = ref<string>('');
const password = ref<string>('');
const passwordError = ref<string>('');

const router = useRouter();

if (authStore.isAuthenticated) {
  router.push('/');
}

const userData = ref<UserData>({
  firstName: '',
  surname: '',
  email: '',
  password: '',
  date: '',
});

const shippingAddress = ref<Address>({
  country: '',
  city: '',
  street: '',
  code: '',
});

const billingAddress = ref<Address>({
  country: '',
  city: '',
  street: '',
  code: '',
});

const useSameAddress = ref<boolean>(false);
const defaultAddress = ref<boolean>(false);

const isSubmitting = ref<boolean>(false);

const createdCustomer = ref<CustomerSignInResult | null>(null);

const setSameAddress = 'Use the same address for billing';
const checkDefaultAddress = 'Set as default shipping address';

function addSameAddress(): void {
  if (useSameAddress.value) {
    billingPostalCode.value = shippingPostalCode.value;
    billingAddress.value = {
      country: shippingAddress.value.country,
      city: shippingAddress.value.city,
      street: shippingAddress.value.street,
      code: shippingAddress.value.code,
    };
  } else {
    billingAddress.value = { country: '', city: '', street: '', code: '' };
  }
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
  const { country: sCountry, city: sCity, street: sStreet, code: sCode } = shippingAddress.value;

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
    const { country: bCountry, city: bCity, street: bStreet, code: bCode } = billingAddress.value;
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
    street: address.street,
    code: address.code,
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
function validateEmail(value: string): string {
  authStore.setError(null);
  const errorMessageSpace = 'Email address must not contain leading or trailing whitespace';
  const errorMessage = 'Email address must contain an "@" symbol, local part and domain name.';
  const trimmed = value.trim();
  const result = isEmail(value) ? '' : value === trimmed ? errorMessage : errorMessageSpace;
  emailError.value = result;
  return result;
}
function validatePassword(value: string): string {
  authStore.setError(null);
  const errorMessage =
    'Password must contain at least 8 characters, uppercase and lowercase letter, number and special character';
  const result = isPassword(value) ? errorMessage : '';
  passwordError.value = result;
  return result;
}
</script>

<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <div class="forms">
      <form>
        <BaseInput
          v-model="name"
          :label="labelName"
          :placeholder="placeholderName"
          required
          type="text"
          :validate="validateName"
        />
        <BaseInput
          v-model="surname"
          :label="labelSurname"
          :placeholder="placeholderSurname"
          required
          type="text"
          :validate="validateSurame"
        />
        <BaseInput
          v-model="email"
          :label="labelEmail"
          :placeholder="placeholderEmail"
          required
          type="email"
          :validate="validateEmail"
        />
        <BaseInput
          v-model="password"
          :label="labelPassword"
          :placeholder="placeholderPassword"
          required
          type="password"
          :validate="validatePassword"
        />
        <BaseInput
          v-model="date"
          :label="labelDate"
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
          v-model="shippingAddress.street"
          fieldType="street"
          :disabled="false"
        />
        <BaseInput
          v-model="shippingPostalCode"
          :label="labelCode"
          :placeholder="placeholderCode"
          required
          type="text"
          :validate="validateCode"
          :readonly="disabled"
        />
        <div class="chkBoxWrapper">
          <a class="chkBoxText">{{ setSameAddress }}</a>
          <input type="checkbox" class="chkBox" v-model="useSameAddress" @change="addSameAddress" />
        </div>
        <div class="chkBoxWrapper">
          <a class="chkBoxText">{{ checkDefaultAddress }}</a>
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
          v-model="billingAddress.street"
          fieldType="street"
          :disabled="useSameAddress"
        />
        <BaseInput
          v-model="billingPostalCode"
          :label="labelCode"
          :placeholder="placeholderCode"
          required
          type="text"
          :validate="validateCode"
          :readonly="disabled"
        />
        <div class="chkBoxWrapper">
          <a class="chkBoxText">Set as default billing address</a>
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
        color: #727174;
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
  color: #fff;
  display: block;
  width: 50%;
  margin: 10px 0;
  padding: 8px;
}

.server_error {
  color: #ff0000;
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
