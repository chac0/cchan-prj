import * as functions from 'firebase-functions';
import * as sgMailer from '@sendgrid/mail';
import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';

interface SendParameter {
  to: string
  bcc?: string[]
  subject: string
  text: string
}

@Inject()
export class SendGridGateway {
  private apiKey: string
  private fromAddress: string
  constructor() {
    this.apiKey = functions.config().send_grid.api_key;
    this.fromAddress = functions.config().send_grid.from_address;
  }

  public async send({ to, bcc, subject, text }: SendParameter) {
    sgMailer.setApiKey(this.apiKey);
    try {
      await sgMailer.send({
        from: this.fromAddress,
        to,
        bcc,
        subject,
        text
      });
    } catch (e) {
      Log.error(`メール送信時にエラーが発生しました。 エラー内容：${e}`);
      throw e;
    }
  }
}
