import type { Customer } from '@commercetools/platform-sdk';
import type { useAuthStore } from '../stores/auth';
// import type { ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';

export async function getUserData(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<Customer | undefined> {
  if (!authStore.currentApiRoot) return;
  const response = await authStore.currentApiRoot.me().get().execute();
  console.log(response);

  return response.body;
}
/*
export async function fetchAllProducts(): Promise<ProductProjectionPagedQueryResponse | null> {
  if (!authStore.currentApiRoot) return null;
  const response = await authStore.currentApiRoot
    .productProjections()
    .get({
      queryArgs: {
        limit: 100,
      },
    })
    .execute();
  console.log('product', response.body);
  return response.body;
}
*/
