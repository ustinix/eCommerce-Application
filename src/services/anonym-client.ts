import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createAuthMiddlewareForAnonymousSessionFlow } from '@commercetools/sdk-middleware-auth';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;
export function createAnonymClient(): ByProjectKeyRequestBuilder {
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

  return createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
    projectKey,
  });
}
