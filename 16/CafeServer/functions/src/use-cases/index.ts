import * as functions from 'firebase-functions';
// Firebase Config
import * as admin from 'firebase-admin';
admin.initializeApp();
//const db = admin.firestore();

import { resolve } from '../decorators/inject';
import { Runnable, RunnableSample } from '../utils/runnable';
import { Log } from '../utils/log';
import { ZEROCAFE_UNAUTHENTICATED, newInternalError, newPermissionDeniedError } from '../errors/errors';
import { localContext } from '../utils/local-settings';

Log.info(`Firebase project ID: ${process.env.GCLOUD_PROJECT}`);
Log.info(`NODE_ENV: ${process.env.NODE_ENV}`);

// Https on call trigger
export const createUser = createCallable('./create-user-use-case');
export const paymentAnOrder = createCallable('./payment-an-order-use-case');

export const sendMailWhenApology = createSampleCallable('./send-mail-when-apology-use-case');
export const sendMailWhenKeepStock = createSampleCallable('./send-mail-when-keep-stock-use-case');
export const setProducts = createCallable('./set-products-use-case');

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

//const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey("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");

// firestore on create trigger
//export const sendMailWhenOrdered = createCallableOnCreate('./send-mail-when-ordered-use-case', 'orders/{id}');

//サンプル
export const sampleCall = createSampleCallable('./sample_api');
//

//=======================================
//
//  認証ありでのモジュール呼び出し 
//
//=======================================
function createCallable(m0dule: string) {
  return functions.runWith({}).https.onCall(
    async (data: any, context: functions.https.CallableContext): Promise<any> => {
      const auth = process.env.NODE_ENV === 'production' ? context.auth : localContext.auth;
      if (!auth) {
        Log.warn('認証情報が存在しません');
        throw newPermissionDeniedError(ZEROCAFE_UNAUTHENTICATED);
      }
      try {
        console.log(m0dule);
        const runnable = await import(m0dule);
        console.log(runnable);
        const re = await resolve<Runnable>(runnable.default).run(data, auth.uid);
        console.log(re);
        return re;
      } catch (e) {
        // tslint:disable
        console.log(e);
        console.log(e.details);
        if (e instanceof functions.https.HttpsError) {
          // if (instanceOfDetails(e.details)) Log.error(`[${e.details.code}]: ${e.message}, uid: ${e.details.uid}`);
          throw e;
        }
        const ie = newInternalError();
        // if (instanceOfDetails(ie.details)) Log.error(`[${ie.details.code}]: ${ie.message}, uid: ${ie.details.uid}, cause: ${e.message}`);
        throw ie;
      }
    }
  );
}


//=======================================
//
//  認証無しでのモジュール呼び出し 
//
//=======================================
function createSampleCallable(m0dule: string) {
  console.log(m0dule);
  return functions.runWith({}).https.onCall(
    async (data: any, context: functions.https.CallableContext): Promise<any> => {
        try {
          const runnable = await import(m0dule);
          const re = await resolve<RunnableSample>(runnable.default).run(data);
          return re;

      } catch (e) {
          // tslint:disable
          console.log(e);
          console.log(e.details);
          if (e instanceof functions.https.HttpsError) {
            throw e;
          }
          const ie = newInternalError();
          throw ie;
      }
    }
  );
}

//=======================================
//
//  onCreate時にモジュール呼び出し
//
//=======================================
/*function createCallableOnCreate(m0dule: string, documentPath: string) {
  return functions.firestore
    .document(documentPath)
    .onCreate(async (snapshot, _) => {
      try {
        const runnable = await import(m0dule);
        const result = await resolve<Runnable>(runnable.default).run({ ...snapshot.data() });
        return result;
      } catch (e) {
        console.log(e);
        throw e;
      }
    });
}
*/

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
})

export const genericEmail = functions.https.onRequest((request, response) => {
    const msg = {
        templateId: TEMPLATE_ID,
        from: 'admin@chaco.lc',
        to: 'chaco@chaco.lc',
        subject: 'どなった？',
//        html: 'できてるよ！',
        dynamic_template_data: {
            subject: 'You Got An Order',
            name: 'Shop_001',
            number: '11',
        },
    };

    //   await sgMail.send(msg).then(() => console.log('email sent'))
    return sgMail
        .send(msg)
        .then(() => console.log('email sent'))
        .catch((error) => console.error('<3', error.toString()))
})

export const orderEmail = functions.firestore.document('orders/{id}')
    .onCreate( async (change, context) => {
        const tokyoRef = admin.firestore().collection('orders').doc(context.params.id)
        tokyoRef.get().then(docSnapshot => {
            //      console.log(docSnapshot.data())
            const newValue = docSnapshot.get('0')
            if (newValue.info[0].productId) {
                console.log(newValue.info[0].productId)}
            const msg = {
                templateId: TEMPLATE_ID,
                from: 'admin@chaco.lc',
                to: 'chaco@chaco.lc',
                dynamic_template_data: {
                    prodName: newValue.info[0].productId,
                    quantity: newValue.info[0].amount,
                },

            }
            return sgMail
                .send(msg)
                .then(() => console.log('email sent'))
                .catch((error) => console.error(error.toString()))
        })
    })
