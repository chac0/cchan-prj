// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';
import SendMailWhenApologyUseCase from '../../src/use-cases/send-mail-when-apology-use-case';
import { CreateMailTemplateMediator } from '../../src/mediators/mail/create-mail-template-mediator';
import { OrderRepository } from '../../src/repositories/order-repository';
import { ShopRepository } from '../../src/repositories/shop-repository';
import { UserRepository } from '../../src/repositories/user-repository';
import { MailSubjectRepository } from '../../src/repositories/mail-subject-repository';
import { SendGridGateway } from '../../src/gateways/send-grid';
import { newRepositoryError, getFirestoreErrorDetail } from '../../src/errors/errors';


describe('SendMailWhenApologyUseCase', () => {
  let useCase: SendMailWhenApologyUseCase

  const createMailTemplateStub = sinon.createStubInstance(CreateMailTemplateMediator);
  const orderRepositoryStub = sinon.createStubInstance(OrderRepository);
  const shopRepositoryStub = sinon.createStubInstance(ShopRepository);
  const userRepositoryStub = sinon.createStubInstance(UserRepository);
  const mailSubjectRepositoryStub = sinon.createStubInstance(MailSubjectRepository);
  const sendGrid = new SendGridGateway();
  const mockSend = sinon.stub(sendGrid, 'send');
  
  beforeEach(() => {
    useCase = new SendMailWhenApologyUseCase(
      // @ts-ignore
      createMailTemplateStub,
      orderRepositoryStub,
      shopRepositoryStub,
      userRepositoryStub,
      mailSubjectRepositoryStub,
      sendGrid
    );
  });

  afterEach(() => {
    createMailTemplateStub.forNoticeOfNoStockApology.reset();
    orderRepositoryStub.find.reset();
    shopRepositoryStub.find.reset();
    userRepositoryStub.find.reset();
    mailSubjectRepositoryStub.find.reset();
  });

  describe('run', () => {
    it('メール送信に成功する', async () => {
      createMailTemplateStub.forNoticeOfNoStockApology.callsFake((_, __) => Promise.resolve('template'));
      orderRepositoryStub.find.callsFake((_) => Promise.resolve({ userId: 'userId' }));
      shopRepositoryStub.find.callsFake((_) => Promise.resolve({ name: 'name', mails: ['sample@example.com'], loginMail: 'sample2@example.com' }));
      userRepositoryStub.find.callsFake((_) => Promise.resolve({ id: 'userId', familyName: 'familyName', firstName: 'firstName', email: 'to@example.com' }));
      mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));
  
      try {
        await useCase.run({ id: 'id', productId: 'productId' }, '');
        assert.equal(mockSend.calledOnce, true);
        const params = mockSend.args[0][0];
        const expectedParams = {
          to: 'to@example.com',
          bcc: ['sample@example.com', 'sample2@example.com'],
          subject: 'subject',
          text: 'template'
        }
        assert.deepEqual(params, expectedParams);
      } catch (e) {
        assert.equal(e, null);
      }
    });

    it('Firestoreの読み込みに失敗する', async () => {
        const expectedError = newRepositoryError(getFirestoreErrorDetail('unknown'));
        orderRepositoryStub.find.callsFake((_) => Promise.resolve({ id: 'id', userId: 'userId' }));
        orderRepositoryStub.find.rejects(expectedError);
        
        try {
          await useCase.run({ id: 'id', productId: 'productId' }, '');
          assert.fail();
        } catch (e) {
          assert.equal(e, expectedError);
        }
      });

      it('メール送信に失敗する', async () => {
        const unknownError = new Error('unknown Error');
        createMailTemplateStub.forNoticeOfNoStockApology.callsFake((_, __) => Promise.resolve('template'));
        orderRepositoryStub.find.callsFake((_) => Promise.resolve({ userId: 'userId' }));
        shopRepositoryStub.find.callsFake((_) => Promise.resolve({ name: 'name', mails: ['sample@example.com'] }));
        userRepositoryStub.find.callsFake((_) => Promise.resolve({ id: 'userId', familyName: 'familyName', firstName: 'firstName', email: 'to@example.com' }));
        mailSubjectRepositoryStub.find.callsFake((_) => Promise.resolve({ subject: 'subject' }));

        mockSend.rejects(unknownError);
        try {
          await useCase.run({ id: 'id', productId: 'productId' }, '');
          assert.fail();
        } catch (e) {
          assert.equal(e, unknownError);
        }
      });
  });
});
