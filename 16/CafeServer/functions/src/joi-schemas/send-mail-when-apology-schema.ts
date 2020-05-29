import * as Joi from '@hapi/joi';

export const SendMailWhenApologySchema = () =>
  Joi.object()
    .keys({
      id: Joi.string(),
      productId: Joi.string()
    });
