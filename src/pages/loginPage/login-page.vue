<script setup lang="ts">
import { ref } from 'vue';
import PasswordInput from '../../components/layout/password-input.vue';
import EmailInput from '../../components/layout/email-input.vue';
import { loginCustomer } from '../../services/auth-service';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

const authStore = useAuthStore();

if (authStore.isAuthenticated) {
  router.push('/');
}

const email = ref<string>('');
const emailError = ref<string>('');
const password = ref<string>('');
const passwordError = ref<string>('');

async function login(event: Event): Promise<void> {
  event.preventDefault();
  authStore.setError(null);
  await loginCustomer(email.value, password.value, loginValid, loginFailed);
}

function loginValid(apiRoot: ByProjectKeyRequestBuilder): void {
  authStore.setUser(email.value);
  authStore.setAuth(true);
  authStore.setApiRoot(apiRoot);
  router.push('/');
}
function loginFailed(errorMessage: string): void {
  authStore.setError(errorMessage);
}
function isButtonDisabled(): boolean {
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
    <p>Do not have an account? <RouterLink to="/register">Sign Up</RouterLink></p>
    <p v-if="authStore.errorAuth" class="server_error">{{ authStore.errorAuth }}</p>
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
  @media (max-width: 500px) {
    font-size: 25px;
  }
}
.login_form {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  width: 450px;
  margin: 70px auto;
  @media (max-width: 500px) {
    width: 90%;
    margin: 20px auto;
  }
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
.server_error {
  text-align: center;
  color: v.$color-red;
  font-size: 14px;
}
</style>
