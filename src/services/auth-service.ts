import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import { createAuthForPasswordFlow } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { tokenCache } from '../utils/token-cache';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;
// const saved = localStorage.getItem('cartId');

export async function loginCustomer(
  email: string,
  password: string,
): Promise<ByProjectKeyRequestBuilder> {
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
  // await apiRoot.me().get().execute();
  return apiRoot;
}
