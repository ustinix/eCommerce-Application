import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

const client = new ClientBuilder()
  .withClientCredentialsFlow({
    host: AUTH_URL,
    projectKey,
    credentials: {
      clientId: import.meta.env.VITE_CTP_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
    },
    scopes: [`manage_orders:${projectKey}`, `view_products:${projectKey}`],
  })
  .withHttpMiddleware({
    host: API_URL,
  })
  .build();

const apiRoot = createApiBuilderFromCtpClient(client);

export function createAnonymClient(): ByProjectKeyRequestBuilder {
  return apiRoot.withProjectKey({ projectKey });
}
