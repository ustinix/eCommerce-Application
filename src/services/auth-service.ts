import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import { createAuthForPasswordFlow } from '@commercetools/sdk-client-v2';
import type { TokenCache } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { type ApiError } from '../types/api-error';
// import { createAuthMiddlewareForAnonymousSessionFlow } from '@commercetools/sdk-middleware-auth';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

const tokenCache: TokenCache = {
  get: () => {
    const stored = localStorage.getItem('authToken');
    return stored ? JSON.parse(stored) : null;
  },
  set: token => {
    localStorage.setItem('authToken', JSON.stringify(token));
  },
};

export const loginCustomer = async (
  email: string,
  password: string,
  loginValid: (apiRoot: ByProjectKeyRequestBuilder) => void,
  loginFailed: (error: string) => void,
): Promise<void> => {
  try {
    const passwordClient = createClient({
      middlewares: [
        createAuthForPasswordFlow({
          host: AUTH_URL,
          projectKey,
          credentials: {
            clientId: import.meta.env.VITE_CTP_CLIENT_ID,
            clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
            user: {
              username: email,
              password,
            },
          },
          tokenCache,
        }),
        createHttpClient({
          host: API_URL,
          fetch: globalThis.fetch,
        }),
      ],
    });
    const apiRoot = createApiBuilderFromCtpClient(passwordClient).withProjectKey({ projectKey });
    await apiRoot.me().get().execute();
    loginValid(apiRoot);
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
// logOut
/*
const anonymousClient = createClient({
  middlewares: [
    createAuthMiddlewareForAnonymousSessionFlow({
      host: AUTH_URL,
      projectKey,
      credentials: {
        clientId: import.meta.env.VITE_CTP_CLIENT_ID,
        clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
      },
      scopes: [`manage_project:${projectKey}`],
      fetch,
    }),
    createHttpClient({
      host: API_URL,
      fetch,
    }),
  ],
});

export const anonymApiRoot = createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
  projectKey,
});
*/
