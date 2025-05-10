<script setup lang="ts">
import { ref } from 'vue';

const modelValue = defineModel<string>();
const errorEmail = defineModel<string>('error');

function validateEmail(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;
  const value = event.target.value;
  const valueTrim = event.target.value.trim();

  if (value !== valueTrim) {
    errorEmail.value = 'Email address must not contain leading or trailing whitespace';
  } else {
    const errorMessage = 'Email address must contain an "@" symbol, local part and domain name.';
    errorEmail.value = isEmail(value) ? '' : errorMessage;
  }
}
function isEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
