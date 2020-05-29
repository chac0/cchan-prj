import * as functions from 'firebase-functions';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import {
  getFirestoreErrorDetail,
  ZEROCAFE_DATA_NOT_FOUND,
  newNotFoundError,
  newRepositoryError
} from '../errors/errors';
import { OrderId, Order } from '../models/order';
import { db, Collections } from './firebase';

@Inject()
export class OrderRepository {
  public async find(docId: string) {
    Log.info(`注文(単数) ${docId} を取得します`);
    try {
      const snapshot = await db
        .collection(Collections.ORDER)
        .doc(docId)
        .get()
      
      const orders = snapshot.exists ? (snapshot.data() as Order) : null
      if (!orders) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`注文(単数)を取得しました: ${JSON.stringify(orders)}`);
      return orders;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async findByOrderId(orderId: OrderId): Promise<Order[]> {
    Log.info(`注文(複数) ${orderId} を取得します`);
    try {
        const snapshot = await db
          .collection(Collections.ORDER)
          .where('orderId', '==', orderId)
          .get()
        
      const orders = snapshot.empty ? null : snapshot.docs.map((it) => it.data() as Order)
      if (!orders) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`注文(複数)を取得しました: ${JSON.stringify(orders)}`);
      return orders;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async update(order: Order): Promise<void> {
    Log.info(`注文(単数) ${order.id} を更新します`);
    try {
        await db
          .collection(Collections.ORDER)
          .doc(order.id!)
          .update(order);
          Log.info(`注文 ${order.id} を更新しました`);
    } catch (e) {
      console.error(e)
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
