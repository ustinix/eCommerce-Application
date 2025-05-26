import type { UserProfile } from '../types/user-profile';
import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk';

type UserProfilePersonnel = Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'dateOfBirth'>;

const enum actionsPersonnel {
  firstName = 'setFirstName',
  lastName = 'setLastName',
  email = 'changeEmail',
  dateOfBirth = 'setDateOfBirth',
}

export function crateActionsPersonnel(profile: UserProfilePersonnel): MyCustomerUpdateAction[] {
  const actions: MyCustomerUpdateAction[] = [];
  if (profile.firstName) {
    actions.push({
      action: actionsPersonnel.firstName,
      firstName: profile.firstName,
    });
  }

  if (profile.lastName) {
    actions.push({
      action: actionsPersonnel.lastName,
      lastName: profile.lastName,
    });
  }

  if (profile.email) {
    actions.push({
      action: actionsPersonnel.email,
      email: profile.email,
    });
  }

  if (profile.dateOfBirth) {
    actions.push({
      action: actionsPersonnel.dateOfBirth,
      dateOfBirth: profile.dateOfBirth,
    });
  }
  return actions;
}
