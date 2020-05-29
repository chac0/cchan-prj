// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';
import SendMailWhenOrderedUseCase from '../../src/use-cases/send-mail-when-ordered-use-case';
import { CreateMailTemplateMediator } from '../../src/mediators/mail/create-mail-template-mediator';
import { ShopRepository } from '../../src/repositories/shop-repository';
import { UserRepository } from '../../src/repositories/user-repository';
import { MailSubjectRepository } from '../../src/repositories/mail-subject-repository';
import { SendGridGateway } from '../../src/gateways/send-grid';
import { newRepositoryError, getFirestoreErrorDetail } from '../../src/errors/errors';
import { ProductRepository } from '../../src/repositories/product-repository';
import { OrderForMail, Order } from '../../src/models/order';
import { User } from '../../src/models/user';
import { Product } from '../../src/models/product';
import { Shop } from '../../src/models/shop';
import { OrderRepository } from '../../src/repositories/order-repository';


describe('SendMailWhenApologyUseCase', () => {
  let useCase: SendMailWhenOrderedUseCase

  const createMailTemplateStub = sinon.createStubInstance(CreateMailTemplateMediator);
  const shopRepositoryStub = sinon.createStubInstance(ShopRepository);
  const userRepositoryStub = sinon.createStubInstance(UserRepository);
  const mailSubjectRepositoryStub = sinon.createStubInstance(MailSubjectRepository);
  const productRepositoryStub = sinon.createStubInstance(ProductRepository);
  const orderRepositoryStub = sinon.createStubInstance(OrderRepository);
  const sendGrid = new SendGridGateway();
  const mockSend = sinon.stub(sendGrid, 'send');
  const order: Order = {
    orderId: 'order000',
    userId: 'user000',
    id: 'orderId',
    shopId: 'shop000',
    total: 1000,
    info: [
      {
        productId: 'product000',
        price: 100,
        amount: 1,
        subTotal: 100,
        status: 'none',
        isCanceled: false,
        isDelivered: true
      },
      {
        productId: 'product001',
        price: 300,
        amount: 3,
        subTotal: 900,
        status: 'none',
        isCanceled: false,
        isDelivered: false
      }
    ],
    shippingAddress: {
      postCode: '1410032',
      phone: '080XXXXXXXX',
      address1: '東京都品川区',
      address2: '大崎XXXXX',
      firstName: '次郎',
      familyName: '山田'
    },
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
    { shopId: 'shop001', id: 'product002', name: '商品2' },
    { shopId: 'shop001', id: 'product003', name: '商品3' }
  ];

  const shops: Shop[] = [
    { id: 'shop000', name: '店舗0', mails: ['store0_0@example.com', 'store0_1@example.com'], loginMail: 'login@example.com' },
    { id: 'shop001', name: '店舗1', mails: ['store1_0@example.com', 'store1_1@example.com'] }
  ];
  
  beforeEach(() => {
    useCase = new SendMailWhenOrderedUseCase(
      // @ts-ignore
      createMailTemplateStub,
      userRepositoryStub,
      productRepositoryStub,
      shopRepositoryStub,
      mailSubjectRepositoryStub,
      orderRepositoryStub,
      sendGrid
    );
  });

  afterEach(() => {
    createMailTemplateStub.forNoticeOfOrderConfirmation.reset();
    shopRepositoryStub.find.reset();
    userRepositoryStub.find.reset();
    productRepositoryStub.findByShopId.reset();
    mailSubjectRepositoryStub.find.reset();
    orderRepositoryStub.update.reset();
    orderRepositoryStub.find.reset();
    mockSend.reset();
  });

  describe('run', () => {
    it('メール送信に成功する', async () => {
      userRepositoryStub.find
        .callsFake((_) => Promise.resolve(user));
      productRepositoryStub.findByShopId
        .callsFake((id) => Promise.resolve(products.filter((it) => it.shopId === id)));
      shopRepositoryStub.find.callsFake((_) => Promise.resolve(shops[0]));
      mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));
      createMailTemplateStub.forNoticeOfOrderConfirmation.callsFake((_, __) => Promise.resolve('template'));
      orderRepositoryStub.find.callsFake((_) => Promise.resolve({ }));

      const expectedOrder: OrderForMail = 
        {
          orderId: 'order000',
          id: 'orderId',
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
              status: 'none',
              isCanceled: false,
              isDelivered: true
            },
            {
              productId: 'product001',
              productName: '商品1',
              price: 300,
              amount: 3,
              subTotal: 900,
              status: 'none',
              isCanceled: false,
              isDelivered: false
            }
          ]
        };
  
      try {
        await useCase.run(order);
        const args = createMailTemplateStub.forNoticeOfOrderConfirmation.args[0][0];
        assert.deepEqual(args, [expectedOrder]);

        assert.equal(mockSend.calledOnce, true);
        const params = mockSend.args[0][0];
        const expectedParams = {
          to: 'to@example.com',
          bcc: shops[0].mails!.concat(shops[0].loginMail!),
          subject: 'subject',
          text: 'template'
        };
        assert.deepEqual(params, expectedParams);
        assert(orderRepositoryStub.update.callCount === 1);
      } catch (e) {
        assert.equal(e, null);
      }
    });

    it('Firestoreの読み込みに失敗する', async () => {
        const expectedError = newRepositoryError(getFirestoreErrorDetail('unknown'));
        userRepositoryStub.find.rejects(expectedError);
        
        try {
          await useCase.run(order);
          assert.fail();
        } catch (e) {
          assert.equal(e, expectedError);
        }
    });

    it('メール送信に失敗する', async () => {
      const unknownError = new Error('unknown Error');
      mockSend.rejects(unknownError);
      orderRepositoryStub.find.callsFake((_) => Promise.resolve({  }))
      createMailTemplateStub.forNoticeOfOrderConfirmation.callsFake((_, __) => Promise.resolve('template'));
      shopRepositoryStub.find.callsFake((_) => Promise.resolve({ name: 'name', mails: ['sample@example.com'], id: 'shop000' }));
      userRepositoryStub.find.callsFake((_) => Promise.resolve({ id: 'userId', familyName: 'familyName', firstName: 'firstName', email: 'to@example.com' }));
      mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));
      productRepositoryStub.findByShopId.callsFake((_) => Promise.resolve([
        { shopId: 'shop000', id: 'product000', name: '商品0' }, { shopId: 'shop000', id: 'product001', name: '商品1' }
      ]));

      try {
        await useCase.run(order);
        assert.fail();
      } catch (e) {
        assert.equal(e, unknownError);
        assert(orderRepositoryStub.update.callCount === 0);
      }

      mockSend.reset();
    });

    it('sentConfirmMailがtrueの場合、SendGridからメールを送信しない', async () => {
      userRepositoryStub.find
        .callsFake((_) => Promise.resolve(user));
      productRepositoryStub.findByShopId
        .callsFake((id) => Promise.resolve(products.filter((it) => it.shopId === id)));
      shopRepositoryStub.find.callsFake((_) => Promise.resolve(shops[0]));
      mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));
      createMailTemplateStub.forNoticeOfOrderConfirmation.callsFake((_, __) => Promise.resolve('template'));
      orderRepositoryStub.find.callsFake((_) => Promise.resolve({ sentConfirmMail: true }));

      try {
        await useCase.run(order);

        assert(mockSend.callCount === 0);
      } catch (e) {
        assert.equal(e, null);
      }
    });
  });
});