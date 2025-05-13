import {
  createAuthForClientCredentialsFlow,
  createHttpClient,
  createClient,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { type ApiError } from '../types/api-error';

const projectKey = 'rss-ecom';

const client = createClient({
  middlewares: [
    createAuthForClientCredentialsFlow({
      host: 'https://auth.us-central1.gcp.commercetools.com',
      projectKey,
      credentials: {
        clientId: import.meta.env.VITE_CTP_CLIENT_ID,
        clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
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
  loginValid: () => void,
  loginFailed: (error: string) => void,
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
    loginValid();
  } catch (error: unknown) {
    const defaultError = 'Server authentication error';
    const errorMessage = isCorrectError(error) ? error.message : defaultError;

    loginFailed(errorMessage);
  }
};
function isCorrectError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false;

  if ('message' in error && typeof error.message === 'string') return true;

  return false;
}
