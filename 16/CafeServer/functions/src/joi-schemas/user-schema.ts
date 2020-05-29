import * as Joi from '@hapi/joi';

export const UserSchema = () =>
  Joi.object()
    .keys({
      id: Joi.string(),
      email: Joi.string().email(),
      name: Joi.string(),
      birthDate: Joi.string(),
      gender: Joi.string(),
      phone: Joi.string(),
      createdAt: Joi.string()
    })
    .forbiddenKeys(['createdAt']);
