// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { MailTemplateRepository } from '../../../../src/repositories/mail-template-repository';
import { OrderDetailTemplate } from '../../../../src/mediators/mail/templates/order-detail';
import { OrderForMail } from '../../../../src/models/order';

describe('OrderDetailTemplate', () => {
  let templateCreator: OrderDetailTemplate
  const mailTemplateRepositoryStub = sinon.createStubInstance(MailTemplateRepository);

  beforeEach(() => {
    templateCreator = new OrderDetailTemplate(mailTemplateRepositoryStub);
  })

  afterEach(() => {
    mailTemplateRepositoryStub.find.reset();
  })

  it('購入商品のテンプレートが作成できる', async () => {
    const template = `
       $orderId $total
       $purchasedProducts
       $productName $amount $unitPrice $subTotal
       $purchasedProducts
    `;
    const orders: OrderForMail[] = [
      {
        orderId: 'order000',
        total: 1000,
        info: [
          {
            productName: '商品1',
            price: 100,
            amount: 1,
            subTotal: 100
          },
          {
            productName: '商品2',
            price: 300,
            amount: 3,
            subTotal: 900
          }
        ]
      },
      {
        orderId: 'order000',
        total: 1000,
        info: [
          {
            productName: '商品3',
            price: 100,
            amount: 1,
            subTotal: 100
          },
          {
            productName: '商品4',
            price: 300,
            amount: 3,
            subTotal: 900
          }
        ]
      }
    ];
    
    mailTemplateRepositoryStub.find.callsFake((_) =>
      Promise.resolve({ template }));
    const mailTemplate = await templateCreator.construct(orders);
    assert.equal(
      mailTemplate,`
       order000 2,000
       
       商品1 1 100 100
       
       商品2 3 300 900
       
       商品3 1 100 100
       
       商品4 3 300 900
       
    ` 
    );
  })
});
