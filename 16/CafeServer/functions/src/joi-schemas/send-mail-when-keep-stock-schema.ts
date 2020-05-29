import * as Joi from '@hapi/joi';

export const SendMailWhenKeepStockSchema = () =>
  Joi
    .object()
    .keys({
      id: Joi.string()
    });