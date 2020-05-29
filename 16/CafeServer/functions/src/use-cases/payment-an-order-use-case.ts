import { Runnable } from "../utils/runnable";
import { Order } from "../models/order";
import { Inject } from "../decorators/inject";

@Inject()
export default class PaymentUseCase implements Runnable {
  constructor() { }
  
  public async run({ id }: { id: string }): Promise<Order> {

    try {
      const order = {id} as Order;
      return order;
    } catch (e) {
      throw e
    }
  }
}

// import { Runnable } from "../utils/runnable";
// import { PaymentSchema } from "../joi-schemas/payment-schema";
// import { Validated } from "../decorators/validated";
// import { Order } from "../models/order";
// import { OrderRepository } from "../repositories/order-repository";
// import { Log } from "../utils/log";

// const schema = PaymentSchema()
//   .requiredKeys(['id', 'orderId', 'shopId', 'userId', 'info', 'total', 'idempotencyKey'])

// export default class PaymentUseCase implements Runnable {
//   constructor(private orderRepository: OrderRepository) { }
  
//   @Validated(schema)
//   public async run(context: Order & { idempotencyKey: string }, _: string): Promise<void> {

//     try {
//       const hasAlreadyConfirmed = await this.hasAlreadyConfirmed(context);
//       if (!hasAlreadyConfirmed) {
//         Log.info(`注文のステータスをcancelかacceptedにします`);
//         await this.orderRepository.update({ id: context.id!, info: context.info! });
//       }
      
//       const hasAlreadyAccepted = await this.hasAlreadyAccepted(context);
//       if (!hasAlreadyAccepted) {
//         //
//         //  Ubiregi ---------
//         //
//       }


//       const hasAlreadyStocked = await this.hasAlreadyStocked(context);
//       if (!hasAlreadyStocked) {
//         //
//         //  Stripe ---------
//         //
//       }
//       return
//     } catch (e) {
//       throw e
//     }
//   }

//   // 
//   //  テストしやすくするために、処理をメソッド化 --------------
//   //
//   private async hasAlreadyConfirmed(order: Order): Promise<boolean> {
//     const o = await this.orderRepository.find(order.id!);
//     return o.info!.every((it) => it.status !== 'none' || it.isCanceled);
//   }

//   private async hasAlreadyAccepted(order: Order): Promise<boolean> {
//     const o = await this.orderRepository.find(order.id!);
//     return o.info!.some((it) => it.status === 'accepted');
//   }

//   private async hasAlreadyStocked(order: Order): Promise<boolean> {
//     const o = await this.orderRepository.find(order.id!);
//     return o.info!.some((it) => it.status === 'stock');
//   }
// }
