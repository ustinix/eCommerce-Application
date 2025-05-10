<script setup lang="ts">
const modelValue = defineModel<string>();
const errorSurname = defineModel<string>('error');

function validateName(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;

  const value = event.target.value;

  const valueTrim = event.target.value.trim();

  if (value === valueTrim) {
    const errorMessage =
      'The surname must contain from 2 to 20 Latin letters, and a hyphen is allowed.';
    errorSurname.value = isSuname(value) ? '' : errorMessage;
  } else {
    errorSurname.value = 'Name must not contain leading or trailing whitespace';
  }
}
function isSuname(surname: string): boolean {
  const regex = /^(?=(.*[A-Za-z]){2})[A-Za-z-]{2,20}$/;
  return regex.test(surname);
}
</script>
<template>
  <label class="form_label">Surname<span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="modelValue"
    type="text"
    placeholder="Surname"
    @input="validateName"
    required
  />
  <p class="form_error" :class="{ visible: !!errorSurname }">{{ errorSurname }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
