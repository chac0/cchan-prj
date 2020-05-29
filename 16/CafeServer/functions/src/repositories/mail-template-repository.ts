import { Inject } from "../decorators/inject";
import { Read } from "../mediators/mail/types";
import { db, Collections, MailTemplateDocument } from "./firebase";
import { newNotFoundError, ZEROCAFE_DATA_NOT_FOUND, newRepositoryError, getFirestoreErrorDetail } from "../errors/errors";
import { Log } from "../utils/log";
import * as functions from 'firebase-functions';
import { MailTemplate } from "../models/mail-template";


@Inject()
export class MailTemplateRepository implements Read {
  public async find(templateType: MailTemplateDocument): Promise<MailTemplate> {
    try {
      const snapshot = await db
        .collection(Collections.MAIL_TEMPLATE)
        .doc(templateType)
        .get();

      const mailTemplate = snapshot.exists ? (snapshot.data() as MailTemplate) : null;
      if (!mailTemplate) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`${templateType} のメールテンプレートを取得しました: ${JSON.stringify(mailTemplate)}`);
      return mailTemplate;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      console.log(e)
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }
}
