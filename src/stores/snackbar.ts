import { defineStore } from 'pinia';
import { ref } from 'vue';
import { colorSnackbar } from '../enums/color-snackbar';

export type SnackbarMessage = {
  text: string;
  color?: colorSnackbar;
  timeout?: number;
};
const defaultTime = 3000;
export const useSnackbarStore = defineStore('snackbar', () => {
  const message = ref<SnackbarMessage | null>(null);
  const isVisible = ref(false);

  function hideSnackbar(): void {
    isVisible.value = false;
  }
  function success(text: string, timeout = defaultTime): void {
    message.value = {
      text,
      color: colorSnackbar.success,
      timeout,
    };
    isVisible.value = true;
  }
  function error(text: string, timeout = defaultTime): void {
    message.value = {
      text,
      color: colorSnackbar.error,
      timeout,
    };
    isVisible.value = true;
  }

  return {
    message,
    isVisible,
    error,
    success,
    hideSnackbar,
  };
});
