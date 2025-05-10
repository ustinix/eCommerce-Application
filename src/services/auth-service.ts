import {
  createAuthForClientCredentialsFlow,
  createHttpClient,
  createClient,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { type useAuthStore } from '../stores/auth';
import { type ApiError } from '../types/api-error';

const projectKey = 'rss-ecom';
//const authStore = useAuthStore();

const client = createClient({
  middlewares: [
    createAuthForClientCredentialsFlow({
      host: 'https://auth.us-central1.gcp.commercetools.com',
      projectKey,
      credentials: {
        clientId: 'FqSKjeOeoeNCXw5RuOOeE4nd',
        clientSecret: 'CZORaCmSncHmB5R_2c67ZXa-V6Kg7msA',
      },
    }),
    createHttpClient({
      host: 'https://api.us-central1.gcp.commercetools.com',
      fetch: globalThis.fetch,
    }),
  ],
});

export const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });

export const loginCustomer = async (
  email: string,
  password: string,
  authStore: ReturnType<typeof useAuthStore>,
): Promise<void> => {
  try {
    await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    authStore.setUser(email, password);
    authStore.setAuth(true);
  } catch (error: unknown) {
    const defaultError = 'Server authentication error';
    const errorMessage = isCorrectError(error) ? error.message : defaultError;

    authStore.setError(errorMessage);
  }
};
function isCorrectError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false;

  if ('message' in error && typeof error.message === 'string') return true;

  return false;
}
