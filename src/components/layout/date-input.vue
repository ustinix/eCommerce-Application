<script setup lang="ts">
const modelValue = defineModel<string>();
const errorDate = defineModel<string>('error');

function validateDate(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;
  const value = event.target.value;
  const errorMessage = 'The date must be in the YYYY-MM-DD format.';
  errorDate.value = isDate(value) ? '' : errorMessage;
}
function isDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}
</script>
<template>
  <label class="form_label">Date of birth<span class="primary_color">*</span> </label>
  <input class="form_input" :value="modelValue" type="date" @input="validateDate" required />
  <p class="form_error" :class="{ visible: !!errorDate }">{{ errorDate }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
