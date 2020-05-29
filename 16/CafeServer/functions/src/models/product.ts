import { ISO8601 } from '../utils/iso8601';
import { ShopId } from './shop';

export type ProductId = string;

export interface Product {
  id?: ProductId;
  ubiregiId?: number;
  ubiregiAccountId?: number;
  shopId?: ShopId;
  name?: string;
  price?: string;
  priceType?: string;
  vat?: number;
  stock?: number;
  imagePath?: string;
  isDeliverable?: boolean;
  productUrl?: string;
  createdAt?: ISO8601;
  updatedAt?: ISO8601;
}

export interface ProductSetRequest {
  shopId: ShopId;
  products: Product[];
}
