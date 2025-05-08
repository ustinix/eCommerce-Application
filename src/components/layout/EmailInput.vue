<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const errorEmail = ref<string>('');

function validateEmail(event: Event) {
  const value = event.target.value.trim();
  emit('update:modelValue', value);
  const errorMessage = 'Email address must contain an "@" symbol, local part and domain name.';
  errorEmail.value = isEmail(value) ? '' : errorMessage;
 
}
function isEmail(email: string): boolean {
  if (!email.includes('@')) return false;
  const [localPart, domain] = email.split('@');
  if (localPart === '' || domain === '') return false;
  return true;
}
</script>
<template>
  <label class="form_label">Email address <span class="primary_color">*</span> </label>
  <input
    class="form_input"
    :value="props.modelValue"
    type="email"
    placeholder="Email"
    @input="validateEmail"
  />
  <p class="form_error" :class="{ visible: !!errorEmail }">{{ errorEmail }}</p>
</template>
<style scoped lang="scss">
@use '../../assets/styles/form.scss';
</style>
