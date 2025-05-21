<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  validate?: (value: string) => string;
}>();

const requiredText = '*';

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>();

const inputValue = ref(props.modelValue);
const errorMessage = ref('');
const showPassword = ref(false);

watch(inputValue, value => {
  emit('update:modelValue', value);
  errorMessage.value = props.validate ? props.validate(value) : '';
});
watch(
  () => props.modelValue,
  value => {
    inputValue.value = value;
  },
);
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type || 'text';
});
const passwordToggleIcon = computed(() => {
  if (props.type !== 'password') return;
  return showPassword.value ? 'mdi-eye-off' : 'mdi-eye';
});
const isDateType = computed(() => props.type === 'date');
</script>
<template>
  <div class="form_field">
    <label class="form_label">
      {{ label }}
      <span v-if="required" class="primary_color">{{ requiredText }}</span>
    </label>
    <v-text-field
      v-model="inputValue"
      :type="inputType"
      :placeholder="placeholder"
      :error-messages="errorMessage ? [errorMessage] : []"
      :required="required"
      color="primary"
      variant="outlined"
      :hide-details="false"
      density="compact"
      class="form_input"
      :class="{ 'date-input': isDateType }"
      :append-inner-icon="passwordToggleIcon"
      @click:append-inner="showPassword = !showPassword"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as v;
.form_field {
  text-align: left;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  margin-bottom: 10px;
}
.form_label {
  text-align: left;
  font-family: v.$font;
  font-size: 14px;
  margin-bottom: 8px;
}
.primary_color {
  color: v.$color-red;
}
.date-input {
  position: relative;
  color: #727174;
  :deep(input[type='date']::-webkit-calendar-picker-indicator) {
    position: absolute;
    right: 12px;
  }
}
</style>
