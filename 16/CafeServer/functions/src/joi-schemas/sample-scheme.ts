import * as Joi from '@hapi/joi';

export const SampleSchema = () =>
  Joi.object()
    .keys({
        id: Joi.string(),
        name: Joi.string(),
        price: Joi.number(),
        birthDay: Joi.string(),
        createdAt: Joi.string()
    })
    .forbiddenKeys(['createdAt']);
