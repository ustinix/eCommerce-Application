import type { Customer } from '@commercetools/platform-sdk';
import type { UserProfile } from '../types/user-profile';

export function mapCustomerToUserProfile(customer: Customer): UserProfile {
  return {
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    dateOfBirth: customer.dateOfBirth || '',
    email: customer.email || '',
    addresses: customer.addresses || [],
    defaultShippingAddressId: customer.defaultShippingAddressId || '',
    defaultBillingAddressId: customer.defaultBillingAddressId || '',
  };
}
