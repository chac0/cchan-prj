import { MailTemplateCreator } from "../types";
import { OrderForMail } from "../../../models/order";
import { MailTemplateRepository } from "../../../repositories/mail-template-repository";
import { MailTemplate } from "../../../models/mail-template";
import { MailTemplateDocument } from "../../../repositories/firebase";
import { Inject } from "../../../decorators/inject";

@Inject()
export class OrderDetailTemplate implements MailTemplateCreator {
  private formatter = new Intl.NumberFormat('ja-JP');
  constructor(private mailTemplateRepository: MailTemplateRepository) {}

  public async construct(orders: OrderForMail[]): Promise<MailTemplate['template']> {
    const orderInfo = orders
      .map((it) => it.info!)
      .reduce((pre, curr) => pre.concat(curr));
    const orderId = orders[0].orderId!
    const total = orders
      .map((it) => it.total!)
      .reduce((pre, curr) => pre + curr)
    const result = await this.mailTemplateRepository.find(MailTemplateDocument.ORDER_DETAIL);
    const template = result.template
      .replace(/\$orderId/gi, orderId)
      .replace(/\$orderNo/gi, orderId.substr(11))
      .replace(/\$total/gi, this.formatter.format(total))
      .replace(...this._replacePurchasedProductsTemplate(orderInfo, result.template))
      .replace(/\\n/g, '\n');
    return template;
  }

  private _replacePurchasedProductsTemplate(orderInfo: OrderForMail['info'], originalTemplate: string): [string, string] {
    const start = originalTemplate.indexOf('$purchasedProducts');
    const end = originalTemplate.lastIndexOf('$purchasedProducts') + '$purchasedProducts'.length;
    const template = originalTemplate.substring(start, end).replace(/\$purchasedProducts/gi, '');
    const newTemplate = orderInfo!
      .map((it) => template
        .replace(/\$productName/gi, it.productName!)
        .replace(/\$unitPrice/gi, this.formatter.format(it.price!))
        .replace(/\$amount/gi, this.formatter.format(it.amount!))
        .replace(/\$subTotal/gi, this.formatter.format(it.subTotal!))
      )
      .reduce((pre, curr) => pre +  curr);
    return [originalTemplate.substring(start, end), newTemplate];
  }
}
