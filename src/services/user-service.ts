import type { Customer } from '@commercetools/platform-sdk';
import type { UserProfile } from '../types/user-profile';
import type { useAuthStore } from '../stores/auth';
import { mapCustomerToUserProfile } from '../utils/map-user-profile';

export async function getUserData(
  authStore: ReturnType<typeof useAuthStore>,
): Promise<UserProfile | null> {
  if (!authStore.currentApiRoot) return null;
  const response = await authStore.currentApiRoot.me().get().execute();
  const customer: Customer = response.body;
  if (!customer) return null;
  console.log(customer);
  return mapCustomerToUserProfile(customer);
}
