<script setup lang="ts">
const modelValue = defineModel<string>();
const errorDate = defineModel<string>('error');

function validateDate(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;
  const value = event.target.value;

  let errorMessage = '';
  if (!isDate(value)) {
    errorMessage = 'The date must be in the YYYY-MM-DD format.';
  } else if (!isAgeEnough(value, 13)) {
    errorMessage = 'You must be at least 13 years old.';
  }

  errorDate.value = errorMessage;
}
function isDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

function isAgeEnough(dateString: string, minAge: number): boolean {
  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= minAge;
}
</script>
<template>
  <label class="form_label">Date of birth<span class="primary_color">*</span> </label>
  <input class="form_input date" :value="modelValue" type="date" @input="validateDate" required />
  <p class="form_error" :class="{ visible: !!errorDate }">{{ errorDate }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
