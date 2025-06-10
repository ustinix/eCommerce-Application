import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  createAuthForAnonymousSessionFlow,
  createClient,
  createHttpClient,
  type AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { tokenCache } from '../utils/token-cache';
import { v4 as uuidv4 } from 'uuid';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

export function getOrCreateAnonymousId(): string {
  let anonymousId = localStorage.getItem('ct-anonymous-id');
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem('ct-anonymous-id', anonymousId);
  }
  return anonymousId;
}
//localStorage.removeItem('ct-anonymous-id');

export async function createAnonymClient(): Promise<ByProjectKeyRequestBuilder> {
  const anonymousId = getOrCreateAnonymousId();
  const authOptions: AuthMiddlewareOptions = {
    host: AUTH_URL,
    projectKey,
    credentials: {
      clientId: import.meta.env.VITE_CTP_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
    },
    scopes: [
      `manage_my_orders:${projectKey}`,
      `view_products:${projectKey}`,
      `manage_orders:${projectKey}`,
      `manage_my_profile:${projectKey}`,
    ],
    anonymousId,
    tokenCache,
  } as AuthMiddlewareOptions & { anonymousId: string };

  const ctpClient = createClient({
    middlewares: [
      createAuthForAnonymousSessionFlow(authOptions),
      createHttpClient({ host: API_URL, fetch }),
    ],
  });

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
}
