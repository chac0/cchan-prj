import * as Joi from '@hapi/joi';

export const ProductSchema = () =>
  Joi.object()
    .keys({
        shopId: Joi.string(),
        products: Joi.string(),
    })
