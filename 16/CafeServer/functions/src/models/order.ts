import { ShippingAddress } from "./shipping-address";
import { ISO8601 } from "../utils/iso8601";

export type OrderId = string;

export interface Order {
  id?: string;
  orderId?: OrderId; // (ex. YYYY-MM-DD***)
  shopId?: string;
  userId?: string;
  info?: OrderInfo[];
  total?: number;
  shippingAddress?: ShippingAddress;
  createdAt?: ISO8601;
  sentConfirmMail?: boolean;
}

export interface OrderInfo {
  productId?: string;
  price?: number; 
  amount?: number;
  subTotal?: number;
  isCanceled?: boolean;
  status?: string;
  isDelivered?: boolean;
}

export interface OrderForMail extends Order {
  shopName?: string;
  shopUrl?: string;
  userName?: string;
  info?: OrderInfoForMail[];
}

export interface OrderInfoForMail extends OrderInfo {
  productName?: string;
}
