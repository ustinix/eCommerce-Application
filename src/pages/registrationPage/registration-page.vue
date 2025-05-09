<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const frstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const date = ref('');
const street = ref('');
const city = ref('');
const country = ref('');
const code = ref('');

function handleSubmit(): void {
  console.log(`Регистрация с email: ${email.value}`);
}

function toLoginPage(): void {
  router.push('/login');
}
</script>

<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <div class="forms">
      <form @submit.prevent="handleSubmit">
        <label class="login_label">First Name <span class="primary_color">*</span> </label>
        <input v-model="frstName" type="text" placeholder="First Name" required />
        <label class="login_label">Last Name <span class="primary_color">*</span> </label>
        <input v-model="lastName" type="text" placeholder="Last Name" required />
        <label class="login_label">Email address <span class="primary_color">*</span> </label>
        <input v-model="email" type="email" placeholder="Email" required />
        <label class="login_label">Password <span class="primary_color">*</span> </label>
        <input v-model="password" type="password" placeholder="Password" required />
        <label class="login_label">Date of birth <span class="primary_color">*</span> </label>
        <input v-model="date" type="date" required />
      </form>
      <form class="shipping">
        <h3>Shipping address:</h3>
        <label class="login_label">Street <span class="primary_color">*</span> </label>
        <input v-model="street" type="text" placeholder="Country" required />
        <label class="login_label">City <span class="primary_color">*</span> </label>
        <input v-model="city" type="text" placeholder="City" required />
        <label class="login_label">Country <span class="primary_color">*</span> </label>
        <input v-model="country" type="text" placeholder="Country" required />
        <label class="login_label">Postal code <span class="primary_color">*</span> </label>
        <input v-model="code" type="text" placeholder="Postal code" required />
        <div class="useSameWrapper">
          <a class="useSameText">Use the same adress for billing</a>
          <input type="checkbox" class="useSameChkBox" />
        </div>
      </form>
      <form class="billing">
        <h3>Billing address:</h3>
        <label class="login_label">Street <span class="primary_color">*</span> </label>
        <input v-model="street" type="text" placeholder="Country" required />
        <label class="login_label">City <span class="primary_color">*</span> </label>
        <input v-model="city" type="text" placeholder="City" required />
        <label class="login_label">Country <span class="primary_color">*</span> </label>
        <input v-model="country" type="text" placeholder="Country" required />
        <label class="login_label">Postal code <span class="primary_color">*</span> </label>
        <input v-model="code" type="text" placeholder="Postal code" required />
      </form>
    </div>
    <button type="submit" @click="toLoginPage" class="button">REGISTER</button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;

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
      padding-bottom: 1.3vh;
    }

    .useSameWrapper {
      display: flex;
      justify-content: space-between;
      .useSameText {
        font-size: 15px;
        color: #727174;
      }

      .useSameChkBox {
        width: 2vh;
        padding: 0;
        margin: 0;
      }
    }

    .login_label {
      text-align: left;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;

      .primary_color {
        color: v.$color-red;
      }
    }
  }
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}

button {
  display: block;
  width: 50%;
  margin: 10px 0;
  padding: 8px;
}
</style>
