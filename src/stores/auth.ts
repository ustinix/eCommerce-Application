import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { type User } from '../types/user';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createExistingTokenClient } from '../services/token-client';
import { isToken } from '../utils/is-token';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const user = ref<User | null>(null);
  const errorAuth = ref<string | null>(null);
  const currentApiRoot = ref<ByProjectKeyRequestBuilder | null>(null);
  const saved = localStorage.getItem('authStore');
  if (saved) {
    const parsed = JSON.parse(saved);
    isAuthenticated.value = parsed.isAuthenticated ?? false;
    user.value = parsed.user ?? null;
  }
  const saveToken = localStorage.getItem('authToken');
  if (saveToken) {
    const existingToken = JSON.parse(saveToken);
    currentApiRoot.value = isToken(existingToken) ? createExistingTokenClient(existingToken) : null;
  }
  watch(
    [isAuthenticated, user],
    () => {
      localStorage.setItem(
        'authStore',
        JSON.stringify({
          isAuthenticated: isAuthenticated.value,
          user: user.value,
        }),
      );
    },
    { deep: true },
  );

  const setUser = (data: string | null): void => {
    user.value = data ? { email: data } : null;
  };

  const setError = (error: string | null): void => {
    errorAuth.value = error;
  };
  const setAuth = (value: boolean): void => {
    isAuthenticated.value = value;
  };
  const setApiRoot = (api: ByProjectKeyRequestBuilder | null): void => {
    currentApiRoot.value = api;
  };
  return {
    isAuthenticated,
    user,
    errorAuth,
    currentApiRoot,
    setUser,
    setError,
    setAuth,
    setApiRoot,
  };
});
