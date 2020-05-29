import { MailTemplateCreator } from "../types";
import { OrderForMail } from "../../../models/order";
import { MailTemplateRepository } from "../../../repositories/mail-template-repository";
import { MailTemplate } from "../../../models/mail-template";
import { MailTemplateDocument } from "../../../repositories/firebase";
import { Inject } from "../../../decorators/inject";

@Inject()
export class ShippingInfoTemplate implements MailTemplateCreator {
  constructor(private mailTemplateRepository: MailTemplateRepository) {}

  public async construct([order]: OrderForMail[]): Promise<MailTemplate['template']> {
    if (order.info!.findIndex((it) => it.isDelivered!) === -1) {
      return '';
    }
    const result = await this.mailTemplateRepository.find(MailTemplateDocument.SHIPPING_INFO);
    const { postCode, address1, address2, address3, familyName, firstName, phone } = order.shippingAddress!;
    const shippingAddress = `${address1}${address2}${address3}`.replace('undefined', '');
    const template = result.template
          .replace(/\$shippingPostCode/gi, postCode!)
          .replace(/\$shippingAddress/gi, shippingAddress)
          .replace(/\$addresseeTel/gi, phone!)
          .replace(/\$addressee/gi, `${familyName!} ${firstName!}`)
          .replace(/\\n/g, '\n');
    return template;
  }
}
