import { Inject } from "../decorators/inject";
import { Runnable } from "../utils/runnable";
import { CreateMailTemplateMediator } from '../mediators/mail/create-mail-template-mediator';
import { UserRepository } from '../repositories/user-repository';
import { ProductRepository } from '../repositories/product-repository';
import { ShopRepository } from '../repositories/shop-repository';
import { SendGridGateway } from '../gateways/send-grid';
import { SendMailWhenOrderedSchema } from "../joi-schemas/send-mail-when-ordered-schema";
import { Validated } from "../decorators/validated";
import { MailSubjectRepository } from "../repositories/mail-subject-repository";
import { OrderForMail, OrderInfoForMail, Order } from "../models/order";
import { MailSubjectDocument } from "../repositories/firebase";
import { Log } from "../utils/log";
import { OrderRepository } from "../repositories/order-repository";

const schema = SendMailWhenOrderedSchema()
  .requiredKeys(['id', 'orderId', 'shopId', 'userId', 'total', 'info']);

@Inject()
export default class SendMailWhenOrderedUseCase implements Runnable {
  constructor(
    private createMailTemplate: CreateMailTemplateMediator,
    private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private shopRepository: ShopRepository,
    private mailSubjectRepository: MailSubjectRepository,
    private orderRepository: OrderRepository,
    private sendGrid: SendGridGateway
  ) {}

  @Validated(schema)
  public async run(order: Order) {
    
    try {
      const orderForMail: OrderForMail = { ...order, info: order.info!.map((it) => ({ ...it}) as OrderInfoForMail) };
      const user = await this.userRepository.find(order.userId!);
      const shop = await this.shopRepository.find(order.shopId!);
      const products = await this.productRepository.findByShopId(order.shopId!);

      orderForMail.userName = `${user.familyName!} ${user.firstName!}`;
      orderForMail.shopName = shop.name!;
      orderForMail.info = orderForMail.info!.map((it) => {
        it.productName = products.find((product) => product.id === it.productId)!.name;
        return it;
      });
      
      const template = await this.createMailTemplate.forNoticeOfOrderConfirmation([orderForMail]);
      const mailSubject = await this.mailSubjectRepository.find(MailSubjectDocument.ORDER_CONFIRMED);
  
      const sentConfirmMail = (await this.orderRepository.find(order.id!)).sentConfirmMail;
      const context = {
        to: user.email!,
        bcc: [...shop.mails!, shop.loginMail!],
        subject: mailSubject.subject!,
        text: template
      };

      if (sentConfirmMail === true) {
        Log.info(`既に確認メールが送信されているため、処理を終了します`);
        return context;
      }

      await this.sendGrid.send(context);
      Log.info(`注文確認メールの送信完了しました。mailContext: ${JSON.stringify(context)}`);

      await this.orderRepository
      .update({
        ...order,
        sentConfirmMail: true,
        info: order.info!.map((it) => ({ ...it }))
      });

      return context;
    }
    catch (e) {
      throw e;
    }
  }
}
