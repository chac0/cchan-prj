// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { ProductReceiptableTemplate } from '../../../../src/mediators/mail/templates/product-receiptable';
import { MailTemplateRepository } from '../../../../src/repositories/mail-template-repository';

describe('ProductReceiptableTemplate', () => {
  let templateCreator: ProductReceiptableTemplate
  const mailTemplateRepositoryStub = sinon.createStubInstance(MailTemplateRepository);

  beforeEach(() => {
    templateCreator = new ProductReceiptableTemplate(mailTemplateRepositoryStub);
  });

  afterEach(() => {
    mailTemplateRepositoryStub.find.reset();
  });

  it('在庫確保（決済完了）通知のメールテンプレートを作成できる', async () => {
    mailTemplateRepositoryStub.find.callsFake((_) => Promise.resolve({ template: `\\n$customerName 様\\n  $customerName` }));
    const mailTemplate = await templateCreator.construct([{ userName: 'お客' }]);
    assert.equal(mailTemplate, `\nお客 様\n  お客`);
  });

});
