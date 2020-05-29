import { Inject } from "../decorators/inject";
import { Runnable } from "../utils/runnable";
import { UserId } from "../models/user";
import { CreateMailTemplateMediator } from '../mediators/mail/create-mail-template-mediator';
import { OrderRepository } from '../repositories/order-repository';
import { UserRepository } from '../repositories/user-repository';
import { ProductRepository } from '../repositories/product-repository';
import { ShopRepository } from '../repositories/shop-repository';
import { SendGridGateway } from '../gateways/send-grid';
import { SendMailWhenKeepStockSchema } from '../joi-schemas/send-mail-when-keep-stock-schema';
import { Validated } from "../decorators/validated";
import { MailSubjectRepository } from "../repositories/mail-subject-repository";
import { OrderForMail } from "../models/order";
import { MailSubjectDocument } from "../repositories/firebase";
import { Log } from "../utils/log";

const schema = SendMailWhenKeepStockSchema()
  .requiredKeys(['id']);

@Inject()
export default class SendMailWhenKeepStock implements Runnable {
  constructor(
    private createMailTemplate: CreateMailTemplateMediator,
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private shopRepository: ShopRepository,
    private mailSubjectRepository: MailSubjectRepository,
    private sendGrid: SendGridGateway
  ) {}

  @Validated(schema)
  public async run({ id }: { id: string }, _: UserId) {
    
    try {
      const order: OrderForMail = await this.orderRepository.find(id);
      order.info = order.info!.filter((it) => it.isCanceled === false && it.status === 'payment');
      
      if (order.info.length === 0) {
        return order;
      }

      order.total = order.info.map((it) => it.subTotal!).reduce((pre, curr) => pre + curr);

      const user = await this.userRepository.find(order.userId!);
      const shop = await this.shopRepository.find(order.shopId!);
      const products = await this.productRepository.findByShopId(order.shopId!);

      order.userName = `${user.familyName!} ${user.firstName!}`;
      order.shopName = shop.name;
      order.info = order.info.map((it) => {
        it.productName = products.find((product) => product.id === it.productId)!.name;
        return it
      });
      
      const template = await this.createMailTemplate.forNoticeOfProductReceiptable([order]);
      const mailSubject = await this.mailSubjectRepository.find(MailSubjectDocument.PRODUCT_RECEIPTABLE);
      const context = {
        to: user.email!,
        bcc: [...shop.mails!, shop.loginMail!],
        subject: mailSubject.subject!,
        text: template
      };
      await this.sendGrid.send(context);
      Log.info(`決済完了メールの送信完了しました。mailContext: ${JSON.stringify(context)}`);
      return context;
    }
    catch (e) {
      throw e;
    }
  }
}
