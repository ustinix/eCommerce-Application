import { createHttpClient, createClient } from '@commercetools/sdk-client-v2';
import { createAuthForPasswordFlow } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { ByProjectKeyRequestBuilder, MyCustomerSignin } from '@commercetools/platform-sdk';
import { tokenCache } from '../utils/token-cache';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const projectKey = import.meta.env.VITE_CTP_CLIENT_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;
type ExtendedMyCustomerSignin = MyCustomerSignin & {
  anonymousCart?: { id: string };
  anonymousId?: string;
  anonymousCartSignInMode?: 'MergeWithExistingCustomerCart' | 'UseAsNewActiveCustomerCart';
};

export async function loginCustomer(
  email: string,
  password: string,
): Promise<ByProjectKeyRequestBuilder> {
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const apiRoot = await authStore.currentApiRoot;
  const anonymousId = localStorage.getItem('ct-anonymous-id');
  if (cartStore.cart !== null) {
    const cartId = cartStore.cart.id;
    await apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          anonymousCart: { id: cartId },
          anonymousId: anonymousId ?? undefined,
          anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
        } as ExtendedMyCustomerSignin,
      })
      .execute();
    cartStore.cart = null;
    localStorage.removeItem('ct-anonymous-id');
  }
  localStorage.removeItem('authToken');
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
        scopes: [
          `manage_my_orders:${projectKey}`,
          `view_products:${projectKey}`,
          `manage_my_profile:${projectKey}`,
          `manage_my_shopping_lists:${projectKey}`,
          `manage_orders:${projectKey}`,
        ],
        tokenCache,
      }),
      createHttpClient({
        host: API_URL,
        fetch: globalThis.fetch,
      }),
    ],
  });
  const customerApiRoot = createApiBuilderFromCtpClient(passwordClient).withProjectKey({
    projectKey,
  });
  return customerApiRoot;
}
