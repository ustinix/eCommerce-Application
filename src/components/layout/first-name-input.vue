<script setup lang="ts">
const modelValue = defineModel<string>();
const errorName = defineModel<string>('error');

function validateName(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  modelValue.value = event.target.value;
  const value = event.target.value;
  const valueTrim = event.target.value.trim();

  if (value !== valueTrim) {
    errorName.value = 'Name must not contain leading or trailing whitespace';
  } else {
    const errorMessage =
      'The name must consist of Latin letters and numbers, the first character must be letters, at least 4 characters long.';
    errorName.value = isName(value) ? '' : errorMessage;
  }
}
function isName(name: string): boolean {
  //Имя пользователя (с ограничением 4-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква)
  const regex = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
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
  />
  <p class="form_error" :class="{ visible: !!errorName }">{{ errorName }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
