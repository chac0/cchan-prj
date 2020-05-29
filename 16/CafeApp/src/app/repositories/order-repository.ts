import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrderDocument } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderDocRepository {

    private ROOT_PATH: string = 'orders';

    constructor(private firestore: AngularFirestore) {  }

    findAllByShopId(shopId: string): Observable<OrderDocument[]> {
        return this.firestore
          .collection(
            this.ROOT_PATH, (ref) => ref.where('shopId', '==', shopId)
          )
          .valueChanges() as Observable<OrderDocument[]>
    }

    async update(order: OrderDocument) {
      return await this.firestore
        .collection(this.ROOT_PATH)
        .doc(order.id)
        .update({ ...order })
    }
}
