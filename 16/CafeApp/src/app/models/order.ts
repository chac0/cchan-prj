import { Iso8601 } from '../utils/iso8601';
import { ShippingAddress } from './shipping-address';
import { Observable } from 'rxjs';

export class OrderDocument {
  static none = new OrderDocument();

  orderId: string; // (ex. YYYY-MM-DD***)
  id: string;
  userId: string;
  shopId: string;
  info: OrderInfoDocument[];
  total: number;
  createdAt: string; // ISO8601 (ex. 2019-09-18T12:15:27.565+09:00)
  shippingAddress?: ShippingAddress;

  constructor(source: Partial<OrderDocument> = {}) {
    this.orderId = source.orderId || '';
    this.id = source.id || '';
    this.userId = source.userId || '';
    this.shopId = source.shopId || '';
    this.info = source.info || [];
    this.total = source.total || 0;
    this.createdAt = source.createdAt || Iso8601.now();
    this.shippingAddress = source.shippingAddress;
  }
}

export class OrderInfoDocument {
  static none = new OrderInfoDocument();

  productId: string; // ユビレジと連携
  price: number;
  amount: number;
  subTotal: number;
  status: string; // (ex. 'none'(初期値), 'stock'(在庫数を減らせた状態), 'payment'（在庫数を減らした上で支払いまで済んだ状態)
  isCanceled: boolean;
  isDelivered: boolean;

  constructor(source: Partial<OrderInfoDocument> = {}) {
    this.productId = source.productId || '';
    this.price = source.price || 0;
    this.amount = source.amount || 0;
    this.subTotal = source.subTotal || 0;
    this.isCanceled = source.isCanceled || false; 
    this.status = source.status || 'none';
    this.isDelivered = source.isDelivered || false;
  }
}

export interface DisplayedOrderDocument extends OrderDocument {
  userName: string;
  info: DisplayedOrderInfoDocument[];
}

export interface DisplayedOrderInfoDocument extends OrderInfoDocument {
  productName: string;
  brandName: string;
  imagePath$: Observable<string>;
}
