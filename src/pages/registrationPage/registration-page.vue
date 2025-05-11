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

  return !(allFieldsFilled && noErrors);
}

function toLoginPage(): void {
  router.push('/login');
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
        <AddressForm label="Country" placeholder="Country" v-model="shippingAddress.country" />
        <AddressForm label="City" placeholder="City" v-model="shippingAddress.city" />
        <AddressForm label="Street" placeholder="Street" v-model="shippingAddress.street" />
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
        <AddressForm label="Country" placeholder="Country" v-model="billingAddress.country" />
        <AddressForm label="City" placeholder="City" v-model="billingAddress.city" />
        <AddressForm label="Street" placeholder="Street" v-model="billingAddress.street" />
        <PostalCode v-model="billingAddress.code" v-model:error="errors.bilCode" />
        <div class="chkBoxWrapper">
          <a class="chkBoxText">Set as default billing address</a>
          <input type="checkbox" class="chkBox" v-model="defaultAddress" />
        </div>
      </form>
    </div>
    <button type="submit" @click="toLoginPage" class="button" :disabled="!isButtonDisabled()">
      REGISTER
    </button>
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
      padding: 0 0 1vh 0;
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
</style>
