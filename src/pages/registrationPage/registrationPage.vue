<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleSubmit = () => {
  alert(`Регистрация с email: ${email.value}`);
};
</script>

<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <form @submit.prevent="handleSubmit">
      <label class="login_label">Email address <span class="primary_color">*</span> </label>
      <input v-model="email" type="email" placeholder="Email" required />
      <label class="login_label">Password <span class="primary_color">*</span> </label>
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" @click="" class="button">REGISTER</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
.registration-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;

  form {
    display: flex;
    flex-direction: column;

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

input,
button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
</style>
