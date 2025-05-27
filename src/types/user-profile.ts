import type { AddressWithId } from './address';

export type UserProfile = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  addresses: AddressWithId[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
};
