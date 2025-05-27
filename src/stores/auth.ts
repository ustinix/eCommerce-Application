import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
// import { type User } from '../types/user';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createExistingTokenClient } from '../services/token-client';
import { isToken } from '../utils/is-token';
import { decodeToken } from '../utils/token-decoder';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  // const user = ref<User | null>(null);
  const errorAuth = ref<string | null>(null);
  const currentApiRoot = ref<ByProjectKeyRequestBuilder | null>(null);
  const saved = localStorage.getItem('authStore');

  if (saved) {
    const parsed = JSON.parse(saved);
    isAuthenticated.value = parsed.isAuthenticated ?? false;
    // user.value = parsed.user ?? null;
  }
  const saveToken = localStorage.getItem('authToken');
  if (saveToken) {
    const existingToken = JSON.parse(saveToken);
    if (isToken(existingToken)) {
      existingToken.refreshToken = decodeToken(existingToken.refreshToken);
      currentApiRoot.value = createExistingTokenClient(existingToken);
    }
  }
  watch(
    [isAuthenticated],
    () => {
      localStorage.setItem(
        'authStore',
        JSON.stringify({
          isAuthenticated: isAuthenticated.value,
          // user: user.value,
        }),
      );
    },
    { deep: true },
  );
  /*
  const setUser = (data: string | null): void => {
    user.value = data ? { email: data } : null;
  };
*/
  const setError = (error: string | null): void => {
    errorAuth.value = error;
  };
  const setAuth = (value: boolean): void => {
    isAuthenticated.value = value;
  };
  const setApiRoot = (api: ByProjectKeyRequestBuilder | null): void => {
    currentApiRoot.value = api;
    if (api === null) {
      localStorage.removeItem('authToken');
    }
  };
  return {
    isAuthenticated,
    // user,
    errorAuth,
    currentApiRoot,
    // setUser,
    setError,
    setAuth,
    setApiRoot,
  };
});
