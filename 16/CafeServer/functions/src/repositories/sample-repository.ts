import * as functions from 'firebase-functions';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import {
  getFirestoreErrorDetail,
  ZEROCAFE_DATA_NOT_FOUND,
  newNotFoundError,
  newRepositoryError
} from '../errors/errors';
import { Sample } from '../models/sample';
import { db } from './firebase';


@Inject()
export class SampleRepository {
  public async find(id: string): Promise<Sample> {
    console.log('samplerepository find');
    
    Log.info(`Sample Document Item id=${id} を取得します`);
    try {
      const snapshot = await db
        .collection( 'Sample Document' )
        .doc( id )
        .get();
      const data = snapshot.exists ? (snapshot.data() as Sample) : null;
      if (!data) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`取得しました: ${JSON.stringify(data)}`);
      return data;
    } catch (e) {
      Log.info('Errorが発生');
      Log.info(e.message);

      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
