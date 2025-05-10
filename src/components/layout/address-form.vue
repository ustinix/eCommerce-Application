<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const error = ref('');

function validate(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  const value = event.target.value;
  const valueTrim = value.trim();
  emit('update:modelValue', value);

  if (value === valueTrim) {
    const errorMessage =
      'This field must contain from 2 to 20 Latin letters, and a hyphen is allowed.';
    error.value = isAddressField(value) ? '' : errorMessage;
  } else {
    error.value = 'This field must not contain leading or trailing whitespace';
  }
}
function isAddressField(field: string): boolean {
  const regex = /^(?=(.*[A-Za-z]){2})[A-Za-z-]{2,20}$/;
  return regex.test(field);
}
</script>
<template>
  <label class="form_label">{{ label }} <span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="modelValue"
    type="text"
    :placeholder="placeholder"
    @input="validate"
    required
  />
  <p class="form_error" :class="{ visible: !!error }">{{ error }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
