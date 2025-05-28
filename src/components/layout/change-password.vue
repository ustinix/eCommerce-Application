<script setup lang="ts">
import BaseInput from './base-input.vue';
import { reactive, computed, ref } from 'vue';
import { validatePassword } from '../../utils/validate-password';
import { Errors, TextEditComponent } from '../../assets/constants';
import { useUserStore } from '../../stores/user';
import { useAuthStore } from '../../stores/auth';
import { updatePassword } from '../../services/user-service';

const userStore = useUserStore();
const authStore = useAuthStore();

const { toggle } = defineProps<{
  toggle: () => void;
}>();

const placeholderPassword = 'Password';
const enum Labels {
  currentPassword = 'Current Password: ',
  newPassword = 'New Password: ',
  confirmNewPassword = 'Confirm New Password: ',
}

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
const messageUpdate = ref<string>('');
const errorUpdate = ref<string>('');

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
  messageUpdate.value = '';
  errorUpdate.value = '';

  if (userStore.profile === null || authStore.currentApiRoot === null) {
    errorUpdate.value = TextEditComponent.updateErrorMessage;
    return;
  }
  try {
    await updatePassword(passwords.current, passwords.new, userStore, authStore);
    messageUpdate.value = TextEditComponent.updateErrorMessage;
    authStore.logOut();
    authStore.logIn(userStore.profile.email, passwords.new);
    toggle();
  } catch {
    errorUpdate.value = TextEditComponent.updateErrorMessage;
    toggle();
  }
}
</script>

<template>
  <form>
    <BaseInput
      v-model="passwords.current"
      :label="Labels.currentPassword"
      :placeholder="placeholderPassword"
      required
      type="password"
      :validate="validatePassword"
      @update:error="setFieldError('currentPassword', $event)"
    />
    <label>New Password</label>
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
<style lang="scss" scoped></style>
