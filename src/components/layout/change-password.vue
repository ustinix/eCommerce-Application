<script setup lang="ts">
import BaseInput from './base-input.vue';
import { reactive, computed } from 'vue';
import { validatePassword } from '../../utils/validate-password';
import { TextEditComponent } from '../../enums/text-edit-component';
import { Errors } from '../../enums/errors';
import { Labels } from '../../enums/labels';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import { updatePassword } from '../../services/user-service';

const userStore = useUserStore();
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();

const { toggle } = defineProps<{
  toggle: () => void;
}>();

const placeholderPassword = 'Password';

const snackMessage = {
  successPassword: 'Password successfully updated',
  errorPassword: 'Failed to update password',
};
const passwords = reactive({
  current: '',
  new: '',
  confirm: '',
});
const fieldErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  passwordsNotMatch: '',
});

function setFieldError(field: keyof typeof fieldErrors, error: string): void {
  fieldErrors[field] = error;
}
const isButtonDisabled = computed(() => {
  return (
    Object.values(fieldErrors).some(error => error !== '') || passwords.new !== passwords.confirm
  );
});
const isError = computed(() => passwords.new !== passwords.confirm);
function cancelEdit(event: Event): void {
  event.preventDefault();
  toggle();
}

async function saveEdit(event: Event): Promise<void> {
  event.preventDefault();

  if (userStore.profile === null || authStore.currentApiRoot === null) {
    snackbarStore.error(TextEditComponent.updateErrorMessage);
    return;
  }
  try {
    await updatePassword(passwords.current, passwords.new, userStore, authStore);
    authStore.logOut();
    authStore.logIn(userStore.profile.email, passwords.new);
    snackbarStore.success(snackMessage.successPassword);
  } catch {
    snackbarStore.error(snackMessage.errorPassword);
  } finally {
    toggle();
  }
}
</script>

<template>
  <form class="form">
    <BaseInput
      v-model="passwords.current"
      :label="Labels.currentPassword"
      :placeholder="placeholderPassword"
      required
      type="password"
      :validate="validatePassword"
      @update:error="setFieldError('currentPassword', $event)"
    />
    <BaseInput
      v-model="passwords.new"
      :label="Labels.newPassword"
      :placeholder="placeholderPassword"
      required
      type="password"
      :validate="validatePassword"
      @update:error="setFieldError('newPassword', $event)"
    />
    <BaseInput
      v-model="passwords.confirm"
      :label="Labels.confirmNewPassword"
      :placeholder="placeholderPassword"
      required
      type="password"
      :validate="validatePassword"
      @update:error="setFieldError('confirmPassword', $event)"
    />
    <p v-if="isError">{{ Errors.PasswordsNotMatch }}</p>
    <div class="buttons">
      <button class="button" :disabled="isButtonDisabled" @click="saveEdit">
        {{ TextEditComponent.saveButton }}
      </button>
      <button class="button" @click="cancelEdit">{{ TextEditComponent.cancelButton }}</button>
    </div>
  </form>
</template>
<style lang="scss" scoped>
.form {
  width: 100%;
}
.buttons {
  display: flex;
  gap: 10px;
}
</style>
