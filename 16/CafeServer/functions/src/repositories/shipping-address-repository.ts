import * as functions from 'firebase-functions';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import { getFirestoreErrorDetail, newRepositoryError, newNotFoundError, ZEROCAFE_DATA_NOT_FOUND } from '../errors/errors';
import { Collections, db } from './firebase';
import { UserId } from '../models/user';
import { ShippingAddress } from '../models/shipping-address';

@Inject()
export class ShippingAddressRepository {

  public async find(userId: UserId): Promise<ShippingAddress[]> {
    Log.info(`${userId} の配送先を取得します`);
    try {
      const snapshot = await db
        .collection(Collections.USER)
        .doc(userId)
        .collection(Collections.SHIPPING_ADDRESS)
        .get()
        
      const shippingAddresses = snapshot.empty ? null : snapshot.docs.map((it) => it.data() as ShippingAddress)
      if (!shippingAddresses) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`注文を取得しました: ${JSON.stringify(shippingAddresses)}`);
      return shippingAddresses;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async create(shippingAddress: ShippingAddress, userId: UserId): Promise<ShippingAddress> {
    try {
      const ref = await db
        .collection(Collections.USER)
        .doc(userId)
        .collection(Collections.SHIPPING_ADDRESS)
        .doc();

      shippingAddress.id = ref.id;
      await ref.set(shippingAddress);
      return shippingAddress;
    } catch (e) {
      Log.warn(e);
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async update(shippingAddress: ShippingAddress, userId: UserId): Promise<ShippingAddress> {
    try {
      const ref = await db
        .collection(Collections.USER)
        .doc(userId)
        .collection(Collections.SHIPPING_ADDRESS)
        .doc(shippingAddress.id!);

      await ref.update(shippingAddress);
      return shippingAddress;
    } catch (e) {
      Log.warn(e);
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}