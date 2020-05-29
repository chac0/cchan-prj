// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { OrderConfirmedTemplate } from '../../../../src/mediators/mail/templates/order-confirmed';
import { MailTemplateRepository } from '../../../../src/repositories/mail-template-repository';

describe('OrderConfirmedTemplate', () => {
  let templateCreator: OrderConfirmedTemplate
  const mailTemplateRepositoryStub = sinon.createStubInstance(MailTemplateRepository);

  beforeEach(() => {
    templateCreator = new OrderConfirmedTemplate(mailTemplateRepositoryStub);
  })

  afterEach(() => {
    mailTemplateRepositoryStub.find.reset();
  })

  it('注文確認通知のテンプレートが作成できる', async () => {
    mailTemplateRepositoryStub.find.callsFake((_) => Promise.resolve({ template: `\\n$customerName 様\\n  $customerName` }));
    const mailTemplate = await templateCreator.construct([{ userName: 'お客' }]);
    assert.equal(mailTemplate, `\nお客 様\n  お客`);
  })
});
