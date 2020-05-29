import { Inject } from "../decorators/inject";
import { Read } from "../mediators/mail/types";
import { db, Collections, MailSubjectDocument } from "./firebase";
import { newNotFoundError, ZEROCAFE_DATA_NOT_FOUND, newRepositoryError, getFirestoreErrorDetail } from "../errors/errors";
import { Log } from "../utils/log";
import * as functions from 'firebase-functions';
import { MailSubject } from "../models/mail-subject";


@Inject()
export class MailSubjectRepository implements Read {
  public async find(subjectType: MailSubjectDocument): Promise<MailSubject> {
    try {
      const snapshot = await db
        .collection(Collections.MAIL_SUBJECT)
        .doc(subjectType)
        .get();
      const mailSubject = snapshot.exists ? (snapshot.data() as MailSubject) : null;
      if (!mailSubject) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`${subjectType} の件名を取得しました: ${JSON.stringify(mailSubject)}`);
      return mailSubject;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      console.log(e)
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
