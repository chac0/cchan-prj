import { MailTemplateCreator } from "../types";
import { OrderForMail } from "../../../models/order";
import { MailTemplateRepository } from "../../../repositories/mail-template-repository";
import { MailTemplate } from "../../../models/mail-template";
import { MailTemplateDocument } from "../../../repositories/firebase";
import { Inject } from "../../../decorators/inject";

@Inject()
export class ApologyForNoStockTemplate implements MailTemplateCreator {
  constructor(private mailTemplateRepository: MailTemplateRepository) {}

  public async construct([order]: OrderForMail[]): Promise<MailTemplate['template']> {
    const result = await this.mailTemplateRepository.find(MailTemplateDocument.APOLOGY_FOR_NO_STOCK);
    const template = result.template
      .replace(/\$shopName/gi, order.shopName!)
      .replace(/\$shopUrl/gi, order.shopUrl!)
      .replace(/\\n/gi, '\n');
    return template;
  }
}
