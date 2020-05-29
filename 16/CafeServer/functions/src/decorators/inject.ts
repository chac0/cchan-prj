/*tslint:disable:no-import-side-effect*/
import 'reflect-metadata';

type ClassDecorator<T> = (target: T) => void;

export interface TypeKey<T> extends Function {
  prototype: T;
}

export type TypeValue<T> = new (...args: any[]) => T;

const typeToType = new Map<TypeKey<any>, TypeValue<any>>();

export function Inject(key?: TypeKey<any>): ClassDecorator<TypeValue<any>> {
  return (target: TypeValue<any>) => {
    if (key) typeToType.set(key, target);
    else typeToType.set(target, target);
  };
}

export function resolve<T>(target: TypeValue<T>): T {
  return resolve.resolver(target, new Map());
}

resolve.resolver = <T>(target: TypeValue<T>, scope: Map<TypeValue<T>, TypeKey<T>>): T => {
  const actual = typeToType.has(target) ? typeToType.get(target)! : target;
  const tokens = Reflect.getMetadata('design:paramtypes', actual) || [];

  const params = tokens.map((token: TypeValue<any>) => {
    if (scope.has(token)) return scope.get(token);

    const instance = resolve.resolver<any>(token, scope);
    scope.set(token, instance);
    return instance;
  });

  return new actual(...params);
};
