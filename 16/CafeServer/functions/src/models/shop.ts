import { ISO8601 } from '../utils/iso8601';

export type ShopId = string;

export interface Shop {
  id?: ShopId;
  name?: string;
  loginMail?: string;
  mails?: string[];
  phone?: string;
  openDate?: string;
  closedDate?: string;
  openTime?: string;
  closedTime?: string;
  isOpened?: boolean;
  createdAt?: ISO8601;
  updatedAt?: ISO8601;
  url?: string;
}
