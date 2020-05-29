import { Iso8601 } from '../utils/iso8601';

export class ShopDocument {
  static none = new ShopDocument();

  id: string;
  createdAt: Iso8601;
  updatedAt: Iso8601;
  openDate: string;   //YYYY/MM/DD
  closedDate: string; //YYYY/MM/DD
  openTime: string;   //HH:mm
  closedTime: string; //HH:mm
  isOpened: boolean;
  loginMail: string;
  mails: string[]
  name: string;
  phone: string;
  imagePath: string;
  brandName: string;

  constructor(source: Partial<ShopDocument> = {}) {
    this.id = source.id || '';
    this.createdAt = source.createdAt || Iso8601.now();
    this.updatedAt = source.updatedAt || Iso8601.now();
    this.closedTime = source.closedTime || '';
    this.openDate = source.openDate || '';
    this.openTime = source.openTime || '';
    this.isOpened = source.isOpened || false;
    this.loginMail = source.loginMail || '';
    this.mails = source.mails || [];
    this.name = source.name || '';
    this.phone = source.phone || '';
    this.imagePath = source.imagePath || '';
    this.brandName = source.brandName || '';

  }
}
