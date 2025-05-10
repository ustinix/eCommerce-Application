import {
  createAuthForClientCredentialsFlow,
  createHttpClient,
  createClient,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'rss-ecom';

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

export const loginCustomer = async (email: string, password: string): Promise<void> => {
  try {
    const response = await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();

    console.log(response.body);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
