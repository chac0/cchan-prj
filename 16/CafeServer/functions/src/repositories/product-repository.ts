import * as functions from 'firebase-functions';
import { Iso8601 } from '../utils/iso8601';

import { Inject } from '../decorators/inject';
import { Log } from '../utils/log';
import {
  getFirestoreErrorDetail,
  ZEROCAFE_DATA_NOT_FOUND,
  newNotFoundError,
  newRepositoryError
} from '../errors/errors';
import { db, Collections } from './firebase';
import { ProductId, Product } from '../models/product';
import { ShopId } from '../models/shop';

@Inject()
export class ProductRepository {
  public async find(productId: ProductId): Promise<Product> {
    Log.info(`商品 ${productId} を取得します`);
    try {
        const snapshot = await db
          .collection(Collections.PRODUCT)
          .doc(productId)
          .get()
        
      const product = snapshot.exists ? (snapshot.data() as Product) : null
      if (!product) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`商品を取得しました: ${JSON.stringify(product)}`);
      return product;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  public async findByShopId(shopId: ShopId): Promise<Product[]> {
    Log.info(` ${shopId} 店舗の商品を取得します`);
    try {
        const snapshot = await db
          .collection(Collections.PRODUCT)
          .where('shopId', '==', shopId)
          .get()
        
      const products = snapshot.empty ? null :  (snapshot.docs.map((it) => it.data() as Product)) 
      if (!products) throw newNotFoundError(ZEROCAFE_DATA_NOT_FOUND);
      Log.info(`商品を取得しました: ${JSON.stringify(products)}`);
      return products;
    } catch (e) {
      if (e instanceof functions.https.HttpsError) throw e;
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }

  //=============================================
  // 商品情報を更新
  // もしくはidがなければ新規として追加する
  //=============================================
  public async setMulti(ShopID:ShopId, products: Product[]): Promise<Product[]> {
    Log.info(`商品 ${ShopID} を更新/追加します`);

    try {
      //____________________________________
      //batchで商品情報更新もしくは追加
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let batch = db.batch();
      for( var i =0; i< products.length; i++ ){
          const product = products[i];
          const nowDate = Iso8601.now();
          product.updatedAt = nowDate;
        //____________________________________
        //idがない＝新規追加なのでidを生成してセット
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          if( product.id == undefined || product.id == null || product.id == '' ){
            const newId = db.collection(Collections.PRODUCT).doc().id;
            product.id = newId;
            product.createdAt = nowDate;
          }
          //____________________________________
          //batchに追加
          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          const productsRef = db.collection( Collections.PRODUCT ).doc( product.id! );
          batch.set( productsRef,  product );
      }
      //____________________________________
      //batch実行
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      await batch.commit();
      Log.info(`商品 ${ShopID} を更新/追加バッチ実行完了`);

      return Object.assign({}, products);

      
    } catch (e) {
      Log.warn(e);
      throw newRepositoryError(getFirestoreErrorDetail(e.code));
    }
  }  


}
