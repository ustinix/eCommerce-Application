<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { UserProfile } from '../../types/user-profile';
import BaseInput from '../../components/layout/base-input.vue';
import { Labels, Placeholders } from '../../assets/constants';
import { validateName } from '../../utils/validate-name';
import { validateSurame } from '../../utils/validate-surname';
import { validateDate } from '../../utils/validate-date';
import { validateEmail } from '../../utils/validate-email';

const { profile, toggle } = defineProps<{
  profile: UserProfile;
  toggle: () => void;
}>();

const firstName = ref(profile.firstName);
const lastName = ref(profile.lastName);
const email = ref(profile.email);
const dateOfBirth = ref(profile.dateOfBirth);

const enum textComponent {
  saveButton = 'Save',
  cancelButton = 'Cancel',
}
const fieldErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
});
function setFieldError(field: keyof typeof fieldErrors, error: string): void {
  fieldErrors[field] = error;
}
function cancelEdit(event: Event): void {
  event.preventDefault();
  toggle();
}
function saveEdit(event: Event): void {
  event.preventDefault();
  console.log('save');
}
const isButtonDisabled = computed(() => {
  return Object.values(fieldErrors).some(error => error !== '');
});
</script>
<template>
  <form>
    <BaseInput
      data-test="name-input"
      v-model="firstName"
      :label="Labels.labelName"
      :placeholder="Placeholders.placeholderName"
      required
      type="text"
      :validate="validateName"
      @update:error="setFieldError('firstName', $event)"
    />
    <BaseInput
      data-test="surname-input"
      v-model="lastName"
      :label="Labels.labelSurname"
      :placeholder="Placeholders.placeholderSurname"
      required
      type="text"
      :validate="validateSurame"
      @update:error="setFieldError('lastName', $event)"
    />
    <BaseInput
      v-model="email"
      :label="Labels.labelEmail"
      :placeholder="Placeholders.placeholderEmail"
      required
      type="email"
      :validate="validateEmail"
      @update:error="setFieldError('email', $event)"
    />
    <BaseInput
      data-test="date-input"
      v-model="dateOfBirth"
      :label="Labels.labelDate"
      required
      type="date"
      :validate="validateDate"
      @update:error="setFieldError('dateOfBirth', $event)"
    />
    <div class="buttons">
      <button class="button button-save" :disabled="isButtonDisabled" @click="saveEdit">
        {{ textComponent.saveButton }}
      </button>
      <button class="button" @click="cancelEdit">{{ textComponent.cancelButton }}</button>
    </div>
  </form>
</template>
<style lang="scss" scoped>
.button-save:disabled {
  background-color: aqua;
}
</style>
