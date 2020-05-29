import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import {
  getFirebaseAuthErrorDetail,
  getFirestoreErrorDetail,
  ZEROCAFE_DATA_NOT_FOUND,
  newNotFoundError,
  newRepositoryError
} from '../errors/errors';
import { UserId, User } from '../models/user';

import { Collections, db } from './firebase';

@Inject()
export class UserRepository {
  public async find(userId: UserId): Promise<User> {
    Log.info(`ユーザー ${userId} を取得します`);

    try {
      const snapshot = await db
        .collection(Collections.USER)
        .doc(userId)
        .get();
      const user = snapshot.exists ? (snapshot.data() as User) : null;
      if (!user) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`ユーザーを取得しました: ${JSON.stringify(user)}`);
      return user;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async create(user: User): Promise<User> {
    const properties: admin.auth.CreateRequest = { email: user.email };

    try {
      const record = await admin.auth().createUser(properties);
      Log.info(`Firebase Authentication にユーザーを登録しました: ${JSON.stringify(record)}`);
      user.id = record.uid;
    } catch (e) {
      Log.warn(e);
      throw newRepositoryError(getFirebaseAuthErrorDetail(e.code));
    }

    try {
      await db
        .collection(Collections.USER)
        .doc(user.id)
        .set(user);

      return { id: user.id };
    } catch (e) {
      Log.warn(e);
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
