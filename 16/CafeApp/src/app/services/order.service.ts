import { Injectable } from '@angular/core';
import { OrderDocRepository, ProductInfoDocRepository, UserDocRepository } from '../repositories';
import { Observable, combineLatest } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { OrderDocument, DisplayedOrderDocument, ProductInfoDocument, DisplayedOrderInfoDocument } from '../models';
import { UserDocument } from '../models/user';
import { AngularFireStorage } from '@angular/fire/storage';
import { StorageProductImgPathWithFolder } from '../models/storage-image-info';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private orderRepository: OrderDocRepository,
    private userRepository: UserDocRepository,
    private productRepository: ProductInfoDocRepository,
    private storage: AngularFireStorage
  ) { }

  findAllShopOrdersByShopId(shopId: string): Observable<DisplayedOrderDocument[]> {
    const orders$ = this.orderRepository.findAllByShopId(shopId);
    const products$ = this.productRepository.getList(shopId);
    const users$ = this.userRepository.findAll();
    
    return combineLatest(
      orders$,
      products$,
      users$
    ).pipe(
      map((list) => {
        const [orders, products, users] = list;
        return orders.map((it) => this.toDisplayedOrderDocument(it, products, users));
      })
    );
  }

  private toDisplayedOrderDocument(order: OrderDocument, shopProducts: ProductInfoDocument[], users: UserDocument[]): DisplayedOrderDocument {
    const displayedOrder = { ...order } as DisplayedOrderDocument;
    const buyer = users.find((it) => it.id === order.userId);
    const orderInfo = displayedOrder.info
      .filter((it) => shopProducts.find((product) => product.id === it.productId))
      .map((it) => this.toDisplayedOrderInfoDocument(it, shopProducts));
      displayedOrder.userName = `${buyer.familyName} ${buyer.firstName}`;
      displayedOrder.info = orderInfo;
    return displayedOrder as DisplayedOrderDocument;
  }

  private toDisplayedOrderInfoDocument(orderInfo: DisplayedOrderInfoDocument, products: ProductInfoDocument[]): DisplayedOrderInfoDocument {
    const product = products.find((p) => p.id === orderInfo.productId);
    const path = StorageProductImgPathWithFolder(product.shopId) + product.imagePath
    const imagePath = this.storage.ref(path).getDownloadURL() as Observable<string>
    orderInfo.imagePath$ = imagePath;
    orderInfo.brandName = product.brandName;
    orderInfo.productName = product.name;
    return orderInfo;
  }
}
