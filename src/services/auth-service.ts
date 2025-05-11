import {
  createAuthForClientCredentialsFlow,
  createHttpClient,
  createClient,
  createAuthForAnonymousSessionFlow,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient, CustomerSignInResult } from '@commercetools/platform-sdk';
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

export const createCustomer = async (
  email: string,
  password: string,
  authStore: ReturnType<typeof useAuthStore>,
): Promise<CustomerSignInResult> => {
  try {
    const anonymousAuthClient = createClient({
      middlewares: [
        createAuthForAnonymousSessionFlow({
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

    const apiRoot = createApiBuilderFromCtpClient(anonymousAuthClient).withProjectKey({
      projectKey,
    });

    const response = await apiRoot
      .customers()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    authStore.setUser(email, password);
    authStore.setAuth(true);
    return response.body;
  } catch (error: unknown) {
    const defaultError = 'Server create customer error';
    const errorMessage = isCorrectError(error) ? error.message : defaultError;
    authStore.setError(errorMessage);
    throw error;
  }
};
