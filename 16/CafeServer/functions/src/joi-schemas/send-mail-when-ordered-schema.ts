import * as Joi from '@hapi/joi';

export const SendMailWhenOrderedSchema = () =>
  Joi.object()
    .keys({
      id: Joi.string(),
      orderId: Joi.string(),
      shopId: Joi.string(),
      total: Joi.number(),
      shippingAddress: Joi.object(),
      createdAt: Joi.string(),
      userId: Joi.string(),
      sentConfirmMail: Joi.boolean(),
      info: Joi.array().items(Joi.object().keys({
        productId: Joi.string().required(),
        amount: Joi.number().required(),
        price: Joi.number().required(),
        subTotal: Joi.number().required(),
        isDelivered: Joi.boolean().required(),
        isCanceled: Joi.boolean(),
        status: Joi.string()
      }))
    });
