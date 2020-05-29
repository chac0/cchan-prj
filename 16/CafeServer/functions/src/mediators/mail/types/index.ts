import { Order } from "../../../models/order"
import { MailTemplate } from "../../../models/mail-template"

export type MailTemplateCreator = {
  construct: (orders: Order[]) => Promise<MailTemplate['template']>
}

export type Read = {
  find: (...args: any[]) => Promise<any>
}
