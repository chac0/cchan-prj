import { ISO8601 } from '../utils/iso8601';

export type UserId = string;

export interface User {
  id?: UserId;
  email?: string;
  stripeId?: string;
  familyName?: string;
  firstName?: string
  familyNameKana?: string;
  firstNameKana?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  address?: string;
  authenticated?: Boolean;
  createdAt?: ISO8601;
  updatedAt?: ISO8601;
}
