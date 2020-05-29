import * as functions from 'firebase-functions';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import {
  getFirestoreErrorDetail,
  ZEROCAFE_DATA_NOT_FOUND,
  newNotFoundError,
  newRepositoryError
} from '../errors/errors';
import { db, Collections } from './firebase';
import { ShopId, Shop } from '../models/shop';

@Inject()
export class ShopRepository {
  public async find(shopId: ShopId): Promise<Shop> {
    Log.info(`店舗 ${shopId} を取得します`);
    try {
        const snapshot = await db
          .collection(Collections.SHOP)
          .doc(shopId)
          .get()
        
      const shop = snapshot.exists ?( snapshot.data() as Shop) : null
      if (!shop) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`店舗を取得しました: ${JSON.stringify(shop)}`);
      return shop;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
