<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from './base-input.vue';
import { useAuthStore } from '../../stores/auth';
import router from '../../router/router';
import { isEmail } from '../../utils/is-email';
import { isPassword } from '../../utils/is-password';
import { Labels } from '../../enums/labels';
import { Errors } from '../../enums/errors';
import { Placeholders } from '../../enums/placeholders';

const textComponent = {
  submitButton: 'LOG IN',
  link: 'Sign Up',
  text: 'Do not have an account?',
};

const authStore = useAuthStore();

const email = ref<string>('');
const emailError = ref<string>('');
const password = ref<string>('');
const passwordError = ref<string>('');

async function login(event: Event): Promise<void> {
  event.preventDefault();
  await authStore.logIn(email.value, password.value);

  if (authStore.isAuthenticated) {
    router.push('/');
  }
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
  const trimmed = value.trim();
  const result = isEmail(value) ? '' : value === trimmed ? Errors.EmailFormat : Errors.EmailSpace;
  emailError.value = result;
  return result;
}
function validatePassword(value: string): string {
  authStore.setError(null);
  const result = isPassword(value) ? Errors.PasswordFormat : '';
  passwordError.value = result;
  return result;
}
</script>

<template>
  <form class="login_form">
    <BaseInput
      v-model="email"
      :label="Labels.labelEmail"
      :placeholder="Placeholders.placeholderEmail"
      required
      type="email"
      :validate="validateEmail"
    />
    <BaseInput
      v-model="password"
      :label="Labels.labelPassword"
      :placeholder="Placeholders.placeholderPassword"
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
      {{ textComponent.submitButton }}
    </button>
    <p>
      {{ textComponent.text }} <RouterLink to="/register">{{ textComponent.link }}</RouterLink>
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
