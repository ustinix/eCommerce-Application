import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type User } from '../types/user';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const user = ref<User | null>(null);
  const errorAuth = ref<string | null>(null);
  let currentApiRoot: ByProjectKeyRequestBuilder | null = null;

  const setUser = (email: string, password: string): void => {
    user.value = { email, password };
  };

  const setError = (error: string | null): void => {
    errorAuth.value = error;
  };
  const setAuth = (value: boolean): void => {
    isAuthenticated.value = value;
  };
  const setApiRoot = (api: ByProjectKeyRequestBuilder | null): void => {
    currentApiRoot = api;
  };
  const getApiRoot = (): ByProjectKeyRequestBuilder | null => currentApiRoot;

  return {
    isAuthenticated,
    user,
    errorAuth,
    setUser,
    setError,
    setAuth,
    setApiRoot,
    getApiRoot,
  };
});
