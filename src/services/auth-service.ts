import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import { createAuthForPasswordFlow } from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { type ApiError } from '../types/api-error';

const projectKey = 'rss-ecom';

export const loginCustomer = async (
  email: string,
  password: string,
  loginValid: () => void,
  loginFailed: (error: string) => void,
): Promise<void> => {
  try {
    const passwordClient = createClient({
      middlewares: [
        createAuthForPasswordFlow({
          host: 'https://auth.us-central1.gcp.commercetools.com',
          projectKey,
          credentials: {
            clientId: import.meta.env.VITE_CTP_CLIENT_ID,
            clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
            user: {
              username: email,
              password,
            },
          },
        }),
        createHttpClient({
          host: 'https://api.us-central1.gcp.commercetools.com',
          fetch: globalThis.fetch,
        }),
      ],
    });
    const apiRoot = createApiBuilderFromCtpClient(passwordClient).withProjectKey({ projectKey });

    await apiRoot.me().get().execute();
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
