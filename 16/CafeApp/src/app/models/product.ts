import { Iso8601 } from '../utils/iso8601';

export class ProductInfoDocument {
  static none = new ProductInfoDocument();

  id: string;
  name: string;
  brandName: string;
  price: string;//(ex. '600.0')
  priceType: string;//('intax')
  vat: number;
  stock: number;
  imagePath: string;
  productUrl: string;
  createdAt: Iso8601; //ex)2019-09-18T12:15:27.565+09:00
  updatedAt: Iso8601; //ex)2019-09-18T12:15:27.565+09:00
  shopId: string;
  isDeliverable: boolean;
  ubiregiAccountId: string;
  ubiregiId: string;

  // dbには使わない、表示上のデータ
  imageUrl: string;

  constructor(source: Partial<ProductInfoDocument> = {}) {
    this.id = source.id || '';
    this.name = source.name || '';
    this.price = source.price || '';
    this.priceType = source.priceType || '';
    this.brandName = source.brandName || '';
    this.vat = source.vat || 0;
    this.stock = source.stock || 0;
    this.imagePath = source.imagePath || '';
    this.productUrl = source.productUrl || '';
    this.createdAt = source.createdAt || Iso8601.now();
    this.updatedAt = source.updatedAt || Iso8601.now();
    this.shopId = source.shopId || '';
    this.isDeliverable = source.isDeliverable || false;
    this.ubiregiAccountId = source.priceType || '';
    this.ubiregiId = source.priceType || '';
  }

    //================================
    //メンバ変数をcsv stringに変換
    //================================
  ToRowStr(): string {
      let Result:string = '';
      Result += this.id;
      Result += ','+this.name;
      Result += ','+this.price;
      Result += ','+this.priceType;
      Result += ','+this.vat;
      Result += ','+this.stock;
      Result += ','+this.imagePath;
      Result += ','+this.productUrl;
      Result += ','+this.createdAt;
      Result += ','+this.updatedAt;
      return Result;
  }

  addStock(): void {
    this.stock += 11;
  }

}
