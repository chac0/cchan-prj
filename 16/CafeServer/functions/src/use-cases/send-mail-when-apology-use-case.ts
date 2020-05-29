import { Inject } from "../decorators/inject";
import { Runnable } from "../utils/runnable";
import { UserId } from "../models/user";
import { CreateMailTemplateMediator } from '../mediators/mail/create-mail-template-mediator';
import { OrderRepository } from '../repositories/order-repository';
import { ProductId } from "../models/product";
import { ShopRepository } from "../repositories/shop-repository";
import { SendGridGateway } from "../gateways/send-grid";
import { UserRepository } from "../repositories/user-repository";
import { SendMailWhenApologySchema } from "../joi-schemas/send-mail-when-apology-schema";
import { Validated } from "../decorators/validated";
import { MailSubjectRepository } from "../repositories/mail-subject-repository";
import { OrderForMail } from "../models/order";
import { MailSubjectDocument } from "../repositories/firebase";
import { Log } from "../utils/log";

const schema = SendMailWhenApologySchema()
  .requiredKeys(['id', 'productId']);

@Inject()
export default class SendMailWhenApologyUseCase implements Runnable {
  constructor(
    private createMailTemplate: CreateMailTemplateMediator,
    private orderRepository: OrderRepository,
    private shopRepository: ShopRepository,
    private userRepository: UserRepository,
    private mailSubjectRepository: MailSubjectRepository,
    private sendGrid: SendGridGateway
  ) {}

  @Validated(schema)
  public async run({ id }: { id: string, productId: ProductId }, _: UserId) {
    
    try {
      const order: OrderForMail = await this.orderRepository.find(id);
      const user = await this.userRepository.find(order.userId!);
      const shop = await this.shopRepository.find(order.shopId!);
      const mailSubject = await this.mailSubjectRepository.find(MailSubjectDocument.APOLOGY_FOR_NO_STOCK);
      order.shopName = shop.name;
      order.shopUrl = shop.url;

      const template = await this.createMailTemplate.forNoticeOfNoStockApology([order]);
      const context = {
        to: user.email!,
        bcc: [...shop.mails!, shop.loginMail!],
        subject: mailSubject.subject!,
        text: template
      };
      await this.sendGrid.send(context);
      Log.info(`在庫切れメールの送信完了しました。mailContext: ${JSON.stringify(context)}`);
      return context;
    }
    catch (e) {
      throw e;
    }
  }
}
