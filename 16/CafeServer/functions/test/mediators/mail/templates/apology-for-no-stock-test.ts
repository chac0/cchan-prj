// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { ApologyForNoStockTemplate } from '../../../../src/mediators/mail/templates/apology-for-no-stock';
import { MailTemplateRepository } from '../../../../src/repositories/mail-template-repository';

describe('ApologyForNoStockTemplate', () => {
  let templateCreator: ApologyForNoStockTemplate
  const mailTemplateRepositoryStub = sinon.createStubInstance(MailTemplateRepository);

  beforeEach(() => {
    templateCreator = new ApologyForNoStockTemplate(mailTemplateRepositoryStub);
  })

  afterEach(() => {
    mailTemplateRepositoryStub.find.reset();
  })

  it('在庫なし通知のテンプレートが作成できる', async () => {
    mailTemplateRepositoryStub.find.callsFake((_) => Promise.resolve({ template: `$shopName 店\\n  $shopUrl \\n $shopName` }));
    const mailTemplate = await templateCreator.construct([{ shopName: 'テスト店舗', shopUrl: 'https://wwww.test-store.com' }]);
    assert.equal(mailTemplate, `テスト店舗 店\n  https://wwww.test-store.com \n テスト店舗`);
  })
});
