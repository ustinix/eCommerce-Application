import type { Customer } from '@commercetools/platform-sdk';
import type { UserProfile, UserPersonnelData } from '../types/user-profile';
import type { useAuthStore } from '../stores/auth';
import type { useUserStore } from '../stores/user';
import { mapCustomerToUserProfile } from '../utils/map-user-profile';
import { crateActionsPersonnel } from '../utils/create-actions';
import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk';

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

export async function updateUserProfile(
  newProfile: UserPersonnelData,
  userStore: ReturnType<typeof useUserStore>,
  authStore: ReturnType<typeof useAuthStore>,
): Promise<void> {
  if (authStore.currentApiRoot === null || userStore.profile === null) return;
  const actions: MyCustomerUpdateAction[] = crateActionsPersonnel(newProfile);
  const response = await authStore.currentApiRoot
    .me()
    .post({
      body: {
        version: userStore.profile.version,
        actions,
      },
    })
    .execute();
  const newUser = mapCustomerToUserProfile(response.body);
  userStore.profile = newUser;
  console.log('update personal', response.body);
}
export async function updatePassword(
  currentPassword: string,
  newPassword: string,
  userStore: ReturnType<typeof useUserStore>,
  authStore: ReturnType<typeof useAuthStore>,
): Promise<void> {
  if (authStore.currentApiRoot === null || userStore.profile === null) return;
  const response = await authStore.currentApiRoot
    .me()
    .password()
    .post({
      body: {
        version: userStore.profile.version,
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      },
    })
    .execute();
  const newUser = mapCustomerToUserProfile(response.body);
  userStore.profile = newUser;
  console.log('update password', response.body);
}
