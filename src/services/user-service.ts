import type { Customer } from '@commercetools/platform-sdk';
import type { useAuthStore } from '../stores/auth';

export async function getUserData(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<Customer | null> {
  if (!authStore.currentApiRoot) return null;
  const response = await authStore.currentApiRoot.me().get().execute();
  console.log(response);

  return response.body;
}
