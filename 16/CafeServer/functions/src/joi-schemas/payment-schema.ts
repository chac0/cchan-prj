import * as Joi from '@hapi/joi';


export const PaymentSchema = () =>
  Joi.object()
    .keys({
      id: Joi.string(),
      orderId: Joi.string(),
      userId: Joi.string(),
      shopId: Joi.string(),
      total: Joi.number(),
      createdAt: Joi.string(),
      sentConfirmMail: Joi.boolean().allow(null),
      shippingAddress: Joi.object().allow(null),
      info: Joi.array().items(
        Joi.object().keys({
          productId: Joi.string().required(),
          price: Joi.number().required(),
          amount: Joi.number().required(),
          subTotal: Joi.number().required(),
          isCanceled: Joi.boolean().required(),
          status: Joi.string().required(),
          isDelivered: Joi.boolean().required()
        }
      )),
      idempotencyKey: Joi.string()
    })
