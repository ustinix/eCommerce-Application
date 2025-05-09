<script setup lang="ts">
import { ref } from 'vue';
import PasswordInput from '../../components/layout/PasswordInput.vue';
import EmailInput from '../../components/layout/EmailInput.vue';

const email = ref<string>('');
const emailError = ref<string>('');
const password = ref<string>('');
const passwordError = ref<string>('');

function login(event: Event): void {
  event.preventDefault();
  console.log('login', email.value, password.value);
}
function isButtonDisabled() {
  return (
    password.value !== '' &&
    passwordError.value === '' &&
    email.value !== '' &&
    emailError.value === ''
  );
}
</script>

<template>
  <div class="hero">
    <h2 class="hero_title">My Account</h2>
  </div>
  <form class="login_form">
    <EmailInput v-model="email" v-model:error="emailError" />
    <PasswordInput v-model="password" v-model:error="passwordError" />
    <button type="submit" @click="login" class="form_button" :disabled="!isButtonDisabled()">
      LOG IN
    </button>
  </form>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
@use '../../assets/styles/form.scss';
.hero {
  background: url('../../assets/images/hero.png') no-repeat center center;
  background-size: auto 100%;
  width: 100%;
  height: 229px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero_title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 50px;
  line-height: 100%;
  letter-spacing: 0%;
  color: v.$color-white;
  text-align: center;
}
.login_form {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  width: 450px;
  margin: 70px auto;
}

.primary_color {
  color: v.$color-red;
}
.login_error {
  height: 30px;
  padding: 2px;
  margin: 0;
  opacity: 0;
}
.visible {
  opacity: 1;
}
</style>
