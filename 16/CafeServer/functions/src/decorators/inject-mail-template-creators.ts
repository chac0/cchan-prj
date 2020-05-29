import { MailTemplateCreator, Read } from "../mediators/mail/types"
import { resolve } from "./inject"

type MailTemplateConstructor = {
  new(repository: Read, ...args: any[]): MailTemplateCreator
}

export function InjectMailTemplateCreators(
  mailTemplateCreatorClasses: MailTemplateConstructor[]
) {
  return function (_: any, __: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const origin = descriptor.value!;
  
    descriptor.value = function (this: TypedPropertyDescriptor<any>, ...args: any[]) {
      const templateCreators: MailTemplateCreator[] = mailTemplateCreatorClasses.map(it => resolve<MailTemplateCreator>(it));
      const params = [...args, templateCreators];
      return origin.apply(this, params);
    }
  }
}
