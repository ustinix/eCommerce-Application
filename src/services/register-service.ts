import {
  createHttpClient,
  createClient,
  createAuthForAnonymousSessionFlow,
} from '@commercetools/sdk-client-v2';

import type { CustomerSignInResult } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { type useAuthStore } from '../stores/auth';
import { type ApiError } from '../types/api-error';
import { type Address } from '../types/address';

const projectKey = 'rss-ecom';

function isCorrectError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false;

  if ('message' in error && typeof error.message === 'string') return true;

  return false;
}

export const createCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dateOfBirth: string,
  addresses: Address[],
  authStore: ReturnType<typeof useAuthStore>,
  defaultShippingAddress?: number,
  defaultBillingAddress?: number,
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

    const requestBody: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      dateOfBirth: string;
      addresses: Address[];
      defaultShippingAddress?: number;
      defaultBillingAddress?: number;
    } = {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      addresses,
    };

    if (defaultShippingAddress !== undefined) {
      requestBody.defaultShippingAddress = defaultShippingAddress;
    }

    if (defaultBillingAddress !== undefined) {
      requestBody.defaultBillingAddress = defaultBillingAddress;
    }

    const response = await apiRoot
      .customers()
      .post({
        body: requestBody,
      })
      .execute();

    authStore.setUser(email);
    authStore.setAuth(true);
    return response.body;
  } catch (error: unknown) {
    const defaultError = 'Server create customer error';
    const errorMessage = isCorrectError(error) ? error.message : defaultError;
    authStore.setError(errorMessage);
    throw error;
  }
};
