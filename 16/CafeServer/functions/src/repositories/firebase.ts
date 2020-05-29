import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

// admin.initializeApp();

export const db = admin.firestore();

export const enum Collections {
  USER = 'users',
  SHIPPING_ADDRESS = 'shippingAddresses',
  ORDER = 'orders',
  PRODUCT = 'products',
  SHOP = 'shops',
  MAIL_TEMPLATE = 'mailTemplates',
  MAIL_SUBJECT = 'mailSubjects'
}

export const enum MailTemplateDocument {
  ORDER_CONFIRMED = 'orderConfirmed',
  ORDER_DETAIL = 'orderDetail',
  SHIPPING_INFO = 'shippingInfo',
  APOLOGY_FOR_NO_STOCK = 'apologyForNoStock',
  PRODUCT_RECEIPTABLE = 'productReceiptable'
}

export const enum MailSubjectDocument {
  ORDER_CONFIRMED = 'orderConfirmed',
  APOLOGY_FOR_NO_STOCK = 'apologyForNoStock',
  PRODUCT_RECEIPTABLE = 'productReceiptable'
}
