// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import SendMailWhenKeepStockUseCase from '../../src/use-cases/send-mail-when-keep-stock-use-case';
import { CreateMailTemplateMediator } from '../../src/mediators/mail/create-mail-template-mediator';
import { OrderRepository } from '../../src/repositories/order-repository';
import { ShopRepository } from '../../src/repositories/shop-repository';
import { UserRepository } from '../../src/repositories/user-repository';
import { MailSubjectRepository } from '../../src/repositories/mail-subject-repository';
import { SendGridGateway } from '../../src/gateways/send-grid';
import { newRepositoryError, getFirestoreErrorDetail } from '../../src/errors/errors';
import { ProductRepository } from '../../src/repositories/product-repository';
import { OrderForMail } from '../../src/models/order';
import { User } from '../../src/models/user';
import { Product } from '../../src/models/product';
import { Shop } from '../../src/models/shop';

describe('SendMailWhenKeepStockUseCase', () => {
  let useCase: SendMailWhenKeepStockUseCase;

  const createMailTemplateStub = sinon.createStubInstance(CreateMailTemplateMediator);
  const orderRepositoryStub = sinon.createStubInstance(OrderRepository);
  const shopRepositoryStub = sinon.createStubInstance(ShopRepository);
  const userRepositoryStub = sinon.createStubInstance(UserRepository);
  const mailSubjectRepositoryStub = sinon.createStubInstance(MailSubjectRepository);
  const productRepositoryStub = sinon.createStubInstance(ProductRepository);
  const sendGrid = new SendGridGateway();
  const mockSend = sinon.stub(sendGrid, 'send');

  const order: OrderForMail = {
    orderId: 'order000',
    userId: 'user000',
    shopId: 'shop000',
    total: 2500,
    info: [
      {
        productId: 'product000',
        price: 100,
        amount: 1,
        subTotal: 100,
        isCanceled: false,
        status: 'payment'
      },
      {
        productId: 'product001',
        price: 300,
        amount: 3,
        subTotal: 900,
        isCanceled: false,
        status: 'payment'
      },
      {
        productId: 'product002',
        price: 500,
        amount: 1,
        subTotal: 500,
        isCanceled: true,
        status: 'none'
      },
      {
        productId: 'product003',
        price: 500,
        amount: 1,
        subTotal: 500,
        isCanceled: false,
        status: 'stock'
      },
      {
        productId: 'product004',
        price: 500,
        amount: 1,
        subTotal: 500,
        isCanceled: false,
        status: 'accepted'
      }
    ],
    shippingAddress: {
      postCode: '1410032',
      phone: '080XXXXXXXX',
      address1: '東京都品川区',
      address2: '大崎XXXXX',
      firstName: '次郎',
      familyName: '山田'
    }
  };

  const user: User = {
    id: 'user000',
    familyName: '山田',
    firstName: '一郎',
    email: 'to@example.com'
  };

  const products: Product[] = [
    { shopId: 'shop000', id: 'product000', name: '商品0' },
    { shopId: 'shop000', id: 'product001', name: '商品1' },
    { shopId: 'shop000', id: 'product002', name: '商品2' },
    { shopId: 'shop001', id: 'product003', name: '商品3' }
  ];

  const shops: Shop[] = [
    { id: 'shop000', name: '店舗0', mails: ['store0_0@example.com', 'store0_1@example.com'], loginMail: 'login@example.com' },
    { id: 'shop001', name: '店舗1', mails: ['store1_0@example.com', 'store1_1@example.com'] }
  ];


  beforeEach(() => {
    useCase = new SendMailWhenKeepStockUseCase(
      // @ts-ignore
      createMailTemplateStub,
      orderRepositoryStub,
      userRepositoryStub,
      productRepositoryStub,
      shopRepositoryStub,
      mailSubjectRepositoryStub,
      sendGrid
    )
  })

  afterEach(() => {
    createMailTemplateStub.forNoticeOfProductReceiptable.reset();
    orderRepositoryStub.find.reset();
    userRepositoryStub.find.reset();
    productRepositoryStub.findByShopId.reset();
    shopRepositoryStub.find.reset();
    mailSubjectRepositoryStub.find.reset();
    mockSend.reset();
  });

  describe('run', () => {
    it('メール送信に成功する', async () => {
      orderRepositoryStub.find
        .callsFake((_) => Promise.resolve(order));
      userRepositoryStub.find
        .callsFake((_) => Promise.resolve(user));
      productRepositoryStub.findByShopId
        .callsFake((id) => Promise.resolve(products.filter((it) => it.shopId === id)));
      shopRepositoryStub.find.callsFake((_) => Promise.resolve(shops[0]));
      mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));
      createMailTemplateStub.forNoticeOfProductReceiptable.callsFake((_, __) => Promise.resolve('template'));

      const expectedOrders: OrderForMail = {
        orderId: 'order000',
        userId: 'user000',
        userName: '山田 一郎',
        shippingAddress: {
          postCode: '1410032',
          phone: '080XXXXXXXX',
          address1: '東京都品川区',
          address2: '大崎XXXXX',
          firstName: '次郎',
          familyName: '山田'
        },
        shopName: '店舗0',
        shopId: 'shop000',
        total: 1000,
        info: [
          {
            productId: 'product000',
            productName: '商品0',
            price: 100,
            amount: 1,
            subTotal: 100,
            isCanceled: false,
            status: 'payment'
          },
          {
            productId: 'product001',
            productName: '商品1',
            price: 300,
            amount: 3,
            subTotal: 900,
            isCanceled: false,
            status: 'payment'
          }
        ]
      };
  
      try {
        await useCase.run({ id: 'orderId' }, '');
        const args = createMailTemplateStub.forNoticeOfProductReceiptable.args[0][0];
        assert.deepEqual(args, [expectedOrders]);

        assert.equal(mockSend.calledOnce, true);
        const params = mockSend.args[0][0];
        const expectedParams = {
          to: 'to@example.com',
          bcc: [...shops[0].mails!, shops[0].loginMail!],
          subject: 'subject',
          text: 'template'
        };
        assert.deepEqual(params, expectedParams);
      } catch (e) {
        assert.equal(e, null);
      }
    });

    it('Firestoreの読み込みに失敗する', async () => {
        const expectedError = newRepositoryError(getFirestoreErrorDetail('unknown'));
        orderRepositoryStub.find.callsFake((_) => Promise.resolve({ userId: 'userId', shopId: 'shopId' }));
        orderRepositoryStub.find.rejects(expectedError);
        
        try {
          await useCase.run({ id: 'orderId' }, '');
          assert.fail();
        } catch (e) {
          assert.equal(e, expectedError);
        }
      });

      it('メール送信に失敗する', async () => {
        const unknownError = new Error('unknown Error');
        createMailTemplateStub.forNoticeOfProductReceiptable
          .callsFake((_, __) => Promise.resolve('template'));
        orderRepositoryStub.find
          .callsFake((_) => Promise.resolve({ userId: 'userId', shopId: 'shopId',
          info: [{ productId: 'productId', isCanceled: false, status: 'payment', subTotal: 900, amount: 1, unitPrice: 900 }] }));
        shopRepositoryStub.find
          .callsFake((_) => Promise.resolve({ name: 'name', mails: ['sample@example.com'] }));
        userRepositoryStub.find
          .callsFake((_) => Promise.resolve({ id: 'userId', familyName: 'familyName', firstName: 'firstName', email: 'to@example.com' }));
        mailSubjectRepositoryStub.find
          .callsFake((_) => Promise.resolve({ subject: 'subject' }));
        productRepositoryStub.findByShopId
          .callsFake((_) => Promise.resolve([{ id: 'productId', name: 'product' }]));

        mockSend.rejects(unknownError);
        try {
          await useCase.run({ id: 'orderId' }, '');
          assert.fail();
        } catch (e) {
          assert.equal(e, unknownError);
        }
      });

      it('ordrInfoのstatusがpaymentのものが1つもない場合、メールを送信しない', async () => {
        const mockOrder = { info: [{ status: 'none' }] }
        orderRepositoryStub.find
        .callsFake((_) => Promise.resolve(mockOrder));

        try {
          const result = await useCase.run({ id: 'orderId' }, '');
          assert.deepEqual(result, mockOrder);
        } catch (e) {
          assert.equal(e, null);
        }
      });
  });
});
