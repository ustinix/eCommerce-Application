<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import type { UserProfile } from '../../types/user-profile';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import BaseInput from '../../components/layout/base-input.vue';
import { Labels, Placeholders } from '../../assets/constants';
import { validateName } from '../../utils/validate-name';
import { validateSurame } from '../../utils/validate-surname';
import { validateDate } from '../../utils/validate-date';
import { validateEmail } from '../../utils/validate-email';
import { updateUserProfile } from '../../services/user-service';

const userStore = useUserStore();
const authStore = useAuthStore();

const { profile, toggle } = defineProps<{
  profile: UserProfile;
  toggle: () => void;
}>();
const newProfile = reactive({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  dateOfBirth: profile.dateOfBirth,
});
const errorUpdate = ref<string>('');

const enum textComponent {
  saveButton = 'Save',
  cancelButton = 'Cancel',
  updateSuccessMessage = 'Data updated successfully',
  updateErrorMessage = 'An error occurred while updating',
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
async function saveEdit(event: Event): Promise<void> {
  event.preventDefault();
  errorUpdate.value = '';
  if (userStore.profile === null || authStore.currentApiRoot === null) return;
  Object.assign(userStore.profile, newProfile);
  try {
    updateUserProfile(userStore.profile, authStore);
    toggle();
  } catch {
    errorUpdate.value = textComponent.updateErrorMessage;
  }
}
const isButtonDisabled = computed(() => {
  return Object.values(fieldErrors).some(error => error !== '');
});
</script>
<template>
  <form>
    <BaseInput
      data-test="name-input"
      v-model="newProfile.firstName"
      :label="Labels.labelName"
      :placeholder="Placeholders.placeholderName"
      required
      type="text"
      :validate="validateName"
      @update:error="setFieldError('firstName', $event)"
    />
    <BaseInput
      data-test="surname-input"
      v-model="newProfile.lastName"
      :label="Labels.labelSurname"
      :placeholder="Placeholders.placeholderSurname"
      required
      type="text"
      :validate="validateSurame"
      @update:error="setFieldError('lastName', $event)"
    />
    <BaseInput
      v-model="newProfile.email"
      :label="Labels.labelEmail"
      :placeholder="Placeholders.placeholderEmail"
      required
      type="email"
      :validate="validateEmail"
      @update:error="setFieldError('email', $event)"
    />
    <BaseInput
      data-test="date-input"
      v-model="newProfile.dateOfBirth"
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
  <p v-if="errorUpdate !== ''">{{ errorUpdate }}</p>
</template>
<style lang="scss" scoped></style>
