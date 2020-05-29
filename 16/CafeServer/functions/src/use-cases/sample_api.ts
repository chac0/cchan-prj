//
//  onCallのサンプル
//  ・dbからデータ取得
//  ・メール文生成
//  ・メール送信
//
import { SampleRepository } from '../repositories/sample-repository';
import { Sample, SampleRequest } from '../models/sample';
import { Log } from '../utils/log';
import { Inject } from '../decorators/inject';
import { Validated } from '../decorators/validated';
import { RunnableSample } from '../utils/runnable';
import { SampleSchema } from '../joi-schemas/sample-scheme';
import * as config from '../configrations';
const sgMail = require('@sendgrid/mail');

const schema = SampleSchema()
  .requiredKeys(['id'])
  .forbiddenKeys(['createdAt']);

@Inject()
export default class SampleAPI implements RunnableSample  {
  constructor(private repository: SampleRepository) {}

  @Validated(schema)
  public async run(data: SampleRequest ): Promise<Sample> {
    Log.info(`データを取得しますzsdffasfsdf: ${JSON.stringify(data)}`);

    try {

      Log.info('-------はっじまるよーーーーーー');

      //-----------------------------------
      // firestoreからデータ取得(動作確認済)
      //-----------------------------------
      const resultData = await this.repository.find(data.id);
      Log.info(`取得したデータ  ${ JSON.stringify(resultData) }`);

      //-----------------------------------
      // メール送信テスト（動作確認済）
      //-----------------------------------

      //メール文生成
      const body = config.sampleEmailBody('Hello World!', resultData);
      Log.info(  body );

      const api_key = '[YOUR_SENDGRID_API_KEY]'
      sgMail.setApiKey( api_key );
      const msg = 
      {
          "personalizations" : [
              {
                "to": [{"email": "[YOUR_MAIL]"}],
                "bcc":[
                    {"email": "[YOUR_MAIL-2]"}
                    ,{"email": "[YOUR_MAIL-3]"}
                ]
              }
            ],
            "from": {"email": "[FROM_MAIL]"},
            "subject": "SendGridからの送信テストです！！！！",
            "content": [
              {
                  "type": "text/html",
                  "value": body
              }       
          ]
      };
      
      const mailResult =  await sgMail.send(msg, function(err:any, json:any){
          console.log(err);
          console.log(json)
          if (err) { 
              return console.error(err); 
          }
          else{
              return 'send ok';
          }
      });
      Log.info( mailResult );

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
