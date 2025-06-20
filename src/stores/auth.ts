import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { loginCustomer } from '../services/auth-service';
import { createAnonymClient } from '../services/anonym-client';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createExistingTokenClient } from '../services/token-client';
import { isToken } from '../utils/is-token';
import { isCorrectError } from '../utils/is-error';
import { decodeToken } from '../utils/token-decoder';

const initializeAnonymClient = async (): Promise<ByProjectKeyRequestBuilder> => {
  return createAnonymClient();
};
const anonymClientPromise: Promise<ByProjectKeyRequestBuilder> = initializeAnonymClient();

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const errorAuth = ref<string | null>(null);
  const currentApiRoot = ref<ByProjectKeyRequestBuilder | null>(null);

  anonymClientPromise.then(client => {
    currentApiRoot.value = client;
  });

  const saved = localStorage.getItem('authStore');
  if (saved) {
    const parsed = JSON.parse(saved);
    isAuthenticated.value = parsed.isAuthenticated ?? false;
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
        }),
      );
    },
    { deep: true },
  );

  async function logIn(email: string, password: string): Promise<void> {
    try {
      const apiRoot = await loginCustomer(email, password);
      currentApiRoot.value = apiRoot;
      isAuthenticated.value = true;
      errorAuth.value = null;
    } catch (error: unknown) {
      const defaultError = 'Server authentication error';
      errorAuth.value = isCorrectError(error) ? error.message : defaultError;
      isAuthenticated.value = false;
      currentApiRoot.value = await createAnonymClient();
    }
  }

  async function logOut(): Promise<void> {
    isAuthenticated.value = false;
    localStorage.removeItem('authToken');
    currentApiRoot.value = await createAnonymClient();
  }

  const setError = (error: string | null): void => {
    errorAuth.value = error;
  };
  const setAuth = (value: boolean): void => {
    isAuthenticated.value = value;
  };
  const setApiRoot = (api: ByProjectKeyRequestBuilder): void => {
    currentApiRoot.value = api;
    if (api === null) {
      localStorage.removeItem('authToken');
    }
  };
  return {
    isAuthenticated,
    errorAuth,
    currentApiRoot,
    logIn,
    logOut,
    setError,
    setAuth,
    setApiRoot,
  };
});
