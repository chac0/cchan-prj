import { OrderDocument, DisplayedOrderDocument, OrderInfoDocument } from '../models';

export class OrderMapper {
  constructor() {}

  onOrderConfirmed(displayedOrder: DisplayedOrderDocument): OrderDocument {
    const order = { ...new OrderDocument(displayedOrder) }
    order.info = order.info.map((it) => ({ ...new OrderInfoDocument(it) }))
    return {
      id: displayedOrder.id,
      info: displayedOrder.info.map((it) => ({ ...new OrderInfoDocument(it) }))
    } as OrderDocument
  }

  onPaymentCompleted(displayedOrder: DisplayedOrderDocument): OrderDocument {
    const orderInfo = displayedOrder.info
      .map((it) => ({ ...new OrderInfoDocument(it), status: it.status === 'none' ? 'none' : 'payment' }))
    return { id: displayedOrder.id, info: orderInfo } as OrderDocument
  }
}
