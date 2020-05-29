import * as Joi from '@hapi/joi';
/*tslint:disable:no-import-side-effect*/
import 'reflect-metadata';

import { JOI_INVALID, newInvalidArgumentError } from '../errors/errors';
import { Log } from '../utils/log';

export function Validated(schema: Joi.ObjectSchema): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const method = descriptor.value;
    descriptor.value = function(this: TypedPropertyDescriptor<any>, ...args: any[]) {
      const result = schema.validate(args[0], { abortEarly: false });
      if (result.error) {
        Log.warn(result.error.details.map(detail => detail.message).join(', '));
        Log.info(`対象: ${JSON.stringify(args[0])}`);
        throw newInvalidArgumentError(JOI_INVALID);
      }
      return method.apply(this, args);
    };
    return descriptor;
  };
}
