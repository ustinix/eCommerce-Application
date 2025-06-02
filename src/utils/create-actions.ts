import type { UserPersonnelData, UserProfile } from '../types/user-profile';
import type { AddressWithId, EditAddressProps } from '../types/address';
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
  changeAddress = 'changeAddress',
  addAddress = 'addAddress',
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
export function crateActionsDeleteAddress(
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
export function createActionsChangeAddress(
  address: EditAddressProps,
  userProfile: UserProfile,
): MyCustomerUpdateAction[] {
  const actions: MyCustomerUpdateAction[] = [];

  const updatedAddress = {
    country: address.country ?? '',
    city: address.city,
    streetName: address.streetName,
    postalCode: address.postalCode,
  };
  actions.push({
    action: actionsAddress.changeAddress,
    addressId: address.id,
    address: updatedAddress,
  });

  if (address.defaultShipping && userProfile.defaultBillingAddressId !== address.id) {
    actions.push({
      action: actionsAddress.setDefaultShippingAddress,
      addressId: address.id,
    });
  } else if (!address.defaultShipping && userProfile.defaultShippingAddressId === address.id) {
    actions.push({
      action: actionsAddress.setDefaultShippingAddress,
      addressId: undefined,
    });
  }

  if (address.defaultBilling && userProfile.defaultBillingAddressId !== address.id) {
    actions.push({
      action: actionsAddress.setDefaultBillingAddress,
      addressId: address.id,
    });
  } else if (!address.defaultBilling && userProfile.defaultBillingAddressId === address.id) {
    actions.push({
      action: actionsAddress.setDefaultBillingAddress,
      addressId: undefined,
    });
  }
  return actions;
}

export function createActionsAddAddress(address: AddressWithId): MyCustomerUpdateAction[] {
  const actions: MyCustomerUpdateAction[] = [];

  const updatedAddress = {
    country: address.country ?? '',
    city: address.city,
    streetName: address.streetName,
    postalCode: address.postalCode,
  };
  actions.push({
    action: actionsAddress.addAddress,
    address: updatedAddress,
  });
  return actions;
}
