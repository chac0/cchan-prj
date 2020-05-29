import { OrderForMail } from "../../models/order";
import { MailTemplateCreator } from "./types";
import { InjectMailTemplateCreators } from "../../decorators/inject-mail-template-creators";
import { OrderConfirmedTemplate } from "./templates/order-confirmed";
import { OrderDetailTemplate } from "./templates/order-detail";
import { ShippingInfoTemplate } from "./templates/shipping-info";
import { Inject } from "../../decorators/inject";
import { ApologyForNoStockTemplate } from "./templates/apology-for-no-stock";
import { MailTemplate } from "../../models/mail-template";
import { ProductReceiptableTemplate } from "./templates/product-receiptable";

@Inject()
export class CreateMailTemplateMediator {

  @InjectMailTemplateCreators([OrderConfirmedTemplate, OrderDetailTemplate, ShippingInfoTemplate])
  public async forNoticeOfOrderConfirmation(orders: OrderForMail[], mailTemplateCreators?: MailTemplateCreator[]): Promise<MailTemplate['template']> {
    return this._mergeTemplate(orders, mailTemplateCreators!);
  }

  @InjectMailTemplateCreators([ApologyForNoStockTemplate])
  public async forNoticeOfNoStockApology(orders: OrderForMail[], mailTemplateCreators?: MailTemplateCreator[]): Promise<MailTemplate['template']> {
    return this._mergeTemplate(orders, mailTemplateCreators!);
  }

  @InjectMailTemplateCreators([ProductReceiptableTemplate, OrderDetailTemplate, ShippingInfoTemplate])
  public async forNoticeOfProductReceiptable(orders: OrderForMail[], mailTemplateCreators?: MailTemplateCreator[]): Promise<MailTemplate['template']> {
    return this._mergeTemplate(orders, mailTemplateCreators!)
  }

  private async _mergeTemplate(orders: OrderForMail[], mailTemplateCreators: MailTemplateCreator[]): Promise<MailTemplate['template']> {
    const templates = await Promise.all(
      mailTemplateCreators.map(async (it) => await it.construct(orders))
    )
    const template = templates.reduce((pre, curr) => pre + curr);

    return template;
  }
}
