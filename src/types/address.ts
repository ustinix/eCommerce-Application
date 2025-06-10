export type Address = {
  country: string;
  city: string;
  streetName: string;
  postalCode: string;
};
export type AddressWithId = Partial<Address> & { id?: string };
export type EditAddressProps = AddressWithId & {
  defaultShipping: boolean;
  defaultBilling: boolean;
};
