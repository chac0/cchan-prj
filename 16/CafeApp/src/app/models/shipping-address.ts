import { Iso8601 } from '../utils/iso8601';

export class ShippingAddress {
  static none = new ShippingAddress();

  id: string;
  familyName: string;
  firstName: string;
  familyNameKana: string;
  firstNameKana: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  postCode: string;
  createdAt: Iso8601;
  updatedAt: Iso8601;

  constructor(source: Partial<ShippingAddress> = {}) {
    this.id = source.id || '';
    this.familyName = source.familyName || '';
    this.firstName = source.firstName || '';
    this.familyNameKana = source.familyNameKana || undefined;
    this.firstNameKana = source.firstNameKana || undefined;
    this.phone = source.phone || '';
    this.address1 = source.address1 || '';
    this.address2 = source.address2 || '';
    this.address3 = source.address3 || undefined;
    this.postCode = source.postCode || '';
    this.createdAt = source.createdAt || '2019-09-18T12:15:27.565+09:00';
    this.updatedAt = source.updatedAt || '2019-09-18T12:15:27.565+09:00';
  }
}
