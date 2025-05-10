<script setup lang="ts">
import { ref } from 'vue';

const modelValue = defineModel<string>();
const errorPassword = defineModel<string>('error');

const showPassword = ref<boolean>(false);
const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

function validatePassword(event: Event): void {
  if ((!event.target) instanceof HTMLInputElement) return;

  const value = String(event.target.value.trim());

  modelValue.value = value;

  const errorMessage =
    'Password must contain at least 8 characters, uppercase and lowercase letter, number and special character';
  errorPassword.value =
    value.length < 8 ||
    !/[A-Z]/.test(value) ||
    !/[a-z]/.test(value) ||
    !/\d/.test(value) ||
    !/[!#$%&*@^]/.test(value)
      ? errorMessage
      : '';
}
</script>

<template>
  <label class="form_label">Password <span class="primary_color">*</span> </label>
  <div class="password_wrapper">
    <input
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      placeholder="Password"
      class="password_input"
      @input="validatePassword"
    />
    <button
      type="button"
      :class="showPassword ? 'toggle-button  toggle-button_close' : 'toggle-button'"
      @click="togglePassword"
    ></button>
  </div>
  <p class="form_error" :class="{ visible: !!errorPassword }">{{ errorPassword }}</p>
</template>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as v;
@use '../../assets/styles/form.scss';
.password_wrapper {
  height: 40px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s ease;
  display: flex;
  margin: 0;
  padding: 0;
}

.toggle-button {
  background: url('../../assets/images/eye.svg') no-repeat center center;
  width: 20px;
  margin-right: 13px;
  border: none;
  cursor: pointer;
  &_close {
    background: url('../../assets/images/close-eye.svg') no-repeat center center;
  }
}
.password_input {
  border: none;
  outline: none;
  height: 100%;
  padding: 3px;
  flex: 1;
}
.password_wrapper:has(.password_input:focus) {
  border-color: v.$color-red;
}
</style>
