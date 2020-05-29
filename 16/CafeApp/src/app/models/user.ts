import { ShippingAddress } from './shipping-address';

export class UserDocument {
  static none = () => new UserDocument()

  id: string;
  stripeId: string;
  familyName: string;
  firstName: string;
  familyNameKana: string;
  firstNameKana: string;
  birthDate: string; // YYYY-MM-DD
  gender: string;    // 'MALE', 'FEMALE', 'OTHER'
  phone: string;
  email: string;
  createdAt: string; // ISO8601) ex)2019-09-18T12:15:27.565+09:00
  updatedAt: string; // ISO8601) ex)2019-09-18T12:15:27.565+09:00
  authenticated: boolean;
  shippingAddress?: ShippingAddress;

  constructor(source: Partial<UserDocument> = {}) {
    this.id = source.id || '';
    this.stripeId = source.stripeId || '';
    this.familyName = source.familyName || '';
    this.firstName = source.firstName || '';
    this.familyNameKana = source.familyNameKana || undefined;
    this.firstNameKana = source.firstNameKana || undefined;
    this.familyNameKana = source.familyNameKana || '';
    this.firstNameKana = source.firstNameKana || '';
    this.birthDate = source.birthDate || '1900-01-01';
    this.gender = source.gender || 'MALE';
    this.phone = source.phone || '';
    this.createdAt = source.createdAt || '2019-09-18T12:15:27.565+09:00';
    this.updatedAt = source.updatedAt || '2019-09-18T12:15:27.565+09:00';
    this.authenticated = source.authenticated || false;
    this.email = source.email || '';
  }
}
