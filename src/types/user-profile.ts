import type { AddressWithId } from './address';

export type UserProfile = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  addresses: AddressWithId[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  version: number;
};
export type UserPersonnelData = Pick<
  UserProfile,
  'firstName' | 'lastName' | 'email' | 'dateOfBirth'
>;
