//
//  onCallのサンプル
//  ・dbからデータ取得
//  ・メール文生成
//  ・メール送信
//
import { ProductRepository } from '../repositories/product-repository';
import { Product, ProductSetRequest } from '../models/product';
import { Log } from '../utils/log';
import { Inject } from '../decorators/inject';
import { Runnable } from '../utils/runnable';


@Inject()
export default class SetProducts implements Runnable  {
  constructor(private repository: ProductRepository) {}

  public async run(data: ProductSetRequest, accessUserId: string ): Promise<Product[]> {
    Log.info(`商品情報を更新します。idがなかったら追加します: ${JSON.stringify(data)}`);

    try {
      //-----------------------------------
      // firestoreからデータ取得(動作確認済)
      //-----------------------------------
      const resultData = await this.repository.setMulti(data.shopId, data.products);
      Log.info(`更新/追加したデータ  ${ JSON.stringify(resultData) }`);

      //---------------------------
      // Response
      //---------------------------
      return resultData;
      
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
