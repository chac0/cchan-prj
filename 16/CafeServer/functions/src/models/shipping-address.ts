import { ISO8601 } from '../utils/iso8601';

export type ShippingAddressId = string;

export interface ShippingAddress {
  id?: ShippingAddressId;
  familyName?: string;
  firstName?: string
  familyNameKana?: string;
  firstNameKana?: string;
  postCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  phone?: string;
  createdAt?: ISO8601;
  updatedAt?: ISO8601;
}
