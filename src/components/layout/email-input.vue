<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const modelValue = defineModel<string>();
const errorEmail = defineModel<string>('error');

function validateEmail(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  authStore.setError(null);

  modelValue.value = event.target.value;

  const value = String(event.target.value);
  const valueTrim = value.trim();

  if (value === valueTrim) {
    const errorMessage = 'Email address must contain an "@" symbol, local part and domain name.';

    errorEmail.value = isEmail(value) ? '' : errorMessage;
  } else {
    errorEmail.value = 'Email address must not contain leading or trailing whitespace';
  }
}
function isEmail(email: string): boolean {
  const regex = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}
</script>
<template>
  <label class="form_label">Email address <span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="modelValue"
    type="text"
    placeholder="Email"
    @input="validateEmail"
  />
  <p class="form_error" :class="{ visible: !!errorEmail }">{{ errorEmail }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
