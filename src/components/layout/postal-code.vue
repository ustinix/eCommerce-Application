<script setup lang="ts">
const modelValue = defineModel<string>();
const errorCode = defineModel<string>('error');

function validateCode(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;

  const value = event.target.value;

  const errorMessage =
    'The code must be from 3 to 10 characters, numbers, letters, hyphens and spaces are allowed.';
  errorCode.value = isECode(value) ? '' : errorMessage;
}
function isECode(email: string): boolean {
  const regex = /^[\d A-Za-z-]{3,10}$/;
  return regex.test(email);
}
</script>
<template>
  <label class="form_label">Postal code <span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="modelValue"
    type="text"
    placeholder="Postal code"
    @input="validateCode"
  />
  <p class="form_error" :class="{ visible: !!errorCode }">{{ errorCode }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
