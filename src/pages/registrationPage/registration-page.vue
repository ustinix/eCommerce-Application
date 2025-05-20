<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import EmailInput from '../../components/layout/email-input.vue';
import PasswordInput from '../../components/layout/password-input.vue';
import FirstNameInput from '../../components/layout/first-name-input.vue';
import Surname from '../../components/layout/surname-input.vue';
import Date from '../../components/layout/date-input.vue';
import AddressForm from '../../components/layout/address-form.vue';
import PostalCode from '../../components/layout/postal-code.vue';
import { useAuthStore } from '../../stores/auth';
import { createCustomer } from '../../services/register-service';
import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { type Address } from '../../types/address';
import { countryCityList } from '../../assets/constants';
import { loginCustomer } from '../../services/auth-service';
import type { UserData } from '../../types/user-data';
import { Errors } from '../../assets/constants';

const authStore = useAuthStore();

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

const errors = ref({
  firstName: '',
  surname: '',
  email: '',
  password: '',
  date: '',
  shipCode: '',
  bilCode: '',
});

const isSubmitting = ref<boolean>(false);

const createdCustomer = ref<CustomerSignInResult | null>(null);

const setSameAddress = 'Use the same address for billing';
const checkDefaultAddress = 'Set as default shipping address';

function addSameAddress(): void {
  if (useSameAddress.value) {
    billingAddress.value.country = shippingAddress.value.country;
    nextTick(() => {
      billingAddress.value = {
        ...shippingAddress.value,
        country: billingAddress.value.country,
      };
    });
  } else {
    billingAddress.value = { country: '', city: '', street: '', code: '' };
  }
}

watch(
  [useSameAddress, shippingAddress],
  ([sameAddress, shippingAddr]) => {
    if (sameAddress) {
      billingAddress.value.country = shippingAddr.country;
      nextTick(() => {
        billingAddress.value.city = shippingAddr.city;
        billingAddress.value.street = shippingAddr.street;
        billingAddress.value.code = shippingAddr.code;
      });
    }
  },
  { deep: true, immediate: true },
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
</script>

<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <div class="forms">
      <form>
        <FirstNameInput v-model="userData.firstName" v-model:error="errors.firstName" />
        <Surname v-model="userData.surname" v-model:error="errors.surname" />
        <EmailInput v-model="userData.email" v-model:error="errors.email" />
        <PasswordInput v-model="userData.password" v-model:error="errors.password" />
        <Date v-model="userData.date" v-model:error="errors.date" />
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
        <PostalCode v-model="shippingAddress.code" v-model:error="errors.shipCode" />
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
        <PostalCode
          v-model="billingAddress.code"
          v-model:error="errors.bilCode"
          :disabled="useSameAddress"
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
