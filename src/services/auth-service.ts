import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import { createAuthForPasswordFlow } from '@commercetools/sdk-client-v2';
import type { TokenCache } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { encodeToken, decodeToken } from '../utils/token-decoder';
import { isToken } from '../utils/is-token';
import { isCorrectError } from '../utils/is-error';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

const tokenCache: TokenCache = {
  get: () => {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      const token = JSON.parse(stored);
      token.refreshToken = isToken(token) ? decodeToken(token.refreshToken) : '';
      return token;
    }

    return null;
  },
  set: token => {
    if (!isToken(token)) return;
    token.refreshToken = encodeToken(token.refreshToken);
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
