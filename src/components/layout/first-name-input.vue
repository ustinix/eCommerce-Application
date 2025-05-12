<script setup lang="ts">
const modelValue = defineModel<string>();
const errorName = defineModel<string>('error');

function validateName(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;
  const value = event.target.value;
  const valueTrim = event.target.value.trim();

  if (value === valueTrim) {
    const errorMessage =
      'The name must contain at least one character and no special characters or numbers.';
    errorName.value = isName(value) ? '' : errorMessage;
  } else {
    errorName.value = 'Name must not contain leading or trailing whitespace';
  }
}
function isName(name: string): boolean {
  const regex = /^[A-Za-zЁА-яё]+$/;
  return regex.test(name);
}
</script>
<template>
  <label class="form_label">First name <span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="modelValue"
    type="text"
    placeholder="First name"
    @input="validateName"
    required
  />
  <p class="form_error" :class="{ visible: !!errorName }">{{ errorName }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
