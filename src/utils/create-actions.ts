import type { UserPersonnelData, UserProfile } from '../types/user-profile';
import type { AddressWithId } from '../types/address';
import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk';

const enum actionsPersonnel {
  firstName = 'setFirstName',
  lastName = 'setLastName',
  email = 'changeEmail',
  dateOfBirth = 'setDateOfBirth',
}
const enum actionsAddress {
  removeShippingAddress = 'removeShippingAddressId',
  removeBillingAddressId = 'removeBillingAddressId',
  removeAddress = 'removeAddress',
  setDefaultShippingAddress = 'setDefaultShippingAddress',
  setDefaultBillingAddress = 'setDefaultBillingAddress',
}

export function crateActionsPersonnel(profile: UserPersonnelData): MyCustomerUpdateAction[] {
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
export function crateActionsAddress(
  address: AddressWithId,
  userProfile: UserProfile,
): MyCustomerUpdateAction[] {
  const actions: MyCustomerUpdateAction[] = [];
  if (address.id === undefined) return actions;

  if (userProfile.shippingAddressIds?.includes(address.id)) {
    actions.push({
      action: actionsAddress.removeShippingAddress,
      addressId: address.id,
    });
  }

  if (userProfile.billingAddressIds?.includes(address.id)) {
    actions.push({
      action: actionsAddress.removeBillingAddressId,
      addressId: address.id,
    });
  }
  if (userProfile.defaultShippingAddressId === address.id) {
    actions.push({
      action: actionsAddress.setDefaultShippingAddress,
      addressId: undefined,
    });
  }

  if (userProfile.defaultBillingAddressId === address.id) {
    actions.push({
      action: actionsAddress.setDefaultBillingAddress,
      addressId: undefined,
    });
  }
  actions.push({
    action: actionsAddress.removeAddress,
    addressId: address.id,
  });
  return actions;
}
