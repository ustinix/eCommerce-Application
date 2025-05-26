<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from './base-input.vue';
import { loginCustomer } from '../../services/auth-service';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { isEmail } from '../../utils/is-email';
import { isPassword } from '../../utils/is-password';

const labelEmail = 'Email address';
const placeholderEmail = 'Enter your email';
const labelPassword = 'Password';
const placeholderPassword = 'Password';
const textSumbmitButton = 'LOG IN';
const linkText = 'Sign Up';
const text = 'Do not have an account?';

const authStore = useAuthStore();

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
  <form class="login_form">
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
    <button
      type="submit"
      @click="login"
      class="form_button"
      data-test="login-button"
      :disabled="!isButtonDisabled()"
    >
      {{ textSumbmitButton }}
    </button>
    <p>
      {{ text }} <RouterLink to="/register">{{ linkText }}</RouterLink>
    </p>
    <p v-if="authStore.errorAuth" class="server_error">{{ authStore.errorAuth }}</p>
  </form>
</template>
<style lang="scss" scoped>
@use '../../assets/styles/variables.scss' as v;
@use '../../assets/styles/form.scss';
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
.visible {
  opacity: 1;
}
.server_error {
  text-align: center;
  color: v.$color-red;
  font-size: 14px;
}
</style>
