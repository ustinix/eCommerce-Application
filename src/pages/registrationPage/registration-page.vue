<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EmailInput from '../../components/layout/email-input.vue';
import PasswordInput from '../../components/layout/password-input.vue';
import FirstNameInput from '../../components/layout/first-name-input.vue';
import Surname from '../../components/layout/surname-input.vue';
import Date from '../../components/layout/date-input.vue';
import AddressForm from '../../components/layout/address-form.vue';
import PostalCode from '../../components/layout/postal-code.vue';
import { useAuthStore } from '../../stores/auth';
import { createCustomer } from '../../services/auth-service';
import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { type Address } from '../../types/address';
import { countryCityList } from '../../assets/constants';

const authStore = useAuthStore();

const router = useRouter();

const userData = ref({
  firstName: '',
  surname: '',
  email: '',
  password: '',
  date: '',
});

const shippingAddress = ref({
  country: '',
  city: '',
  street: '',
  code: '',
});

const billingAddress = ref({
  country: '',
  city: '',
  street: '',
  code: '',
});

const useSameAddress = ref(false);
const defaultAddress = ref(false);

const errors = ref({
  firstName: '',
  surname: '',
  email: '',
  password: '',
  date: '',
  shipCode: '',
  bilCode: '',
});

const isSubmitting = ref(false);

const createdCustomer = ref<CustomerSignInResult | null>(null);

function addSameAddress(): void {
  billingAddress.value = useSameAddress.value
    ? JSON.parse(JSON.stringify(shippingAddress.value))
    : { country: '', city: '', street: '', code: '' };
}

function isButtonDisabled(): boolean {
  const requiredFields = [
    userData.value.firstName,
    userData.value.surname,
    userData.value.email,
    userData.value.password,
    userData.value.date,
    shippingAddress.value.country,
    shippingAddress.value.city,
    shippingAddress.value.street,
    shippingAddress.value.code,
    ...(useSameAddress.value
      ? []
      : [
          billingAddress.value.country,
          billingAddress.value.city,
          billingAddress.value.street,
          billingAddress.value.code,
        ]),
  ];

  const allFieldsFilled = requiredFields.every(field => field.trim() !== '');

  const noErrors = Object.values(errors.value).every(error => error === '');

  return !allFieldsFilled || !noErrors;
}

async function registration(event: Event): Promise<void> {
  event.preventDefault();
  authStore.setError(null);
  createdCustomer.value = null;
  isSubmitting.value = true;
  try {
    console.log('Form Data:', userData.value, shippingAddress.value, billingAddress.value);
    const addresses: Address[] = [];
    const shippingCountry = shippingAddress.value.country;
    const shippingCountryCode = countryCityList[shippingCountry]?.isoCode || shippingCountry;
    const shippingAddressIndex = addresses.length;
    addresses.push({
      country: shippingCountryCode,
      city: shippingAddress.value.city,
      streetName: shippingAddress.value.street,
      postalCode: shippingAddress.value.code,
    });
    let billingAddressIndex: number | undefined;
    if (useSameAddress.value) {
      billingAddressIndex = shippingAddressIndex;
    } else {
      const billingCountry = billingAddress.value.country;
      const billingCountryCode = countryCityList[billingCountry]?.isoCode || billingCountry;
      billingAddressIndex = addresses.length;
      addresses.push({
        country: billingCountryCode,
        city: billingAddress.value.city,
        streetName: billingAddress.value.street,
        postalCode: billingAddress.value.code,
      });
    }
    const defaultShippingAddress = defaultAddress.value ? shippingAddressIndex : undefined;
    const defaultBillingAddress = defaultAddress.value
      ? useSameAddress.value
        ? shippingAddressIndex
        : billingAddressIndex
      : undefined;

    const result = await createCustomer(
      userData.value.firstName,
      userData.value.surname,
      userData.value.email,
      userData.value.password,
      addresses,
      authStore,
      defaultShippingAddress,
      defaultBillingAddress,
    );
    createdCustomer.value = result;
    console.log('User created:', createdCustomer.value);
  } catch (error) {
    console.error('Registration failed:', error);
    authStore.setError('Registration failed. Please try again.');
  } finally {
    isSubmitting.value = false;
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
          <a class="chkBoxText">Use the same adress for billing</a>
          <input type="checkbox" class="chkBox" v-model="useSameAddress" @change="addSameAddress" />
        </div>
        <div class="chkBoxWrapper">
          <a class="chkBoxText">Set as default shipping address</a>
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
          :selectedCountry="billingAddress.country"
          :disabled="false"
        />
        <AddressForm
          label="City"
          placeholder="City"
          v-model="billingAddress.city"
          fieldType="city"
          :selectedCountry="billingAddress.country"
          :disabled="!billingAddress.country"
        />
        <AddressForm
          label="Street"
          placeholder="Street"
          v-model="billingAddress.street"
          fieldType="street"
          :disabled="false"
        />
        <PostalCode v-model="billingAddress.code" v-model:error="errors.bilCode" />
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
      class="button"
      :disabled="isButtonDisabled()"
    >
      {{ isSubmitting ? 'Processing...' : 'REGISTER' }}
    </button>
    <p v-if="authStore.errorAuth" class="server_error">{{ authStore.errorAuth }}</p>
    <div v-if="createdCustomer" class="success-message">
      <p>User created successfully!</p>
      <button @click="router.push('/login')" class="button">Go to Login</button>
    </div>
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
    width: 30vh;
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

button {
  display: block;
  width: 50%;
  margin: 10px 0;
  padding: 8px;
}
.success-message {
  width: 50%;
  margin-top: 20px;
  padding: 15px;
  background-color: #f0fff0;
  border: 1px solid #a0d8a0;
  border-radius: 4px;
  text-align: center;

  p {
    margin: 5px 0;
  }

  .button {
    width: 100%;
    margin-top: 10px;
    background-color: #f22735;
    color: white;
  }
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
  }
}
</style>
