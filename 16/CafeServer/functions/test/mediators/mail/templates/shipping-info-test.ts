// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { ShippingInfoTemplate } from '../../../../src/mediators/mail/templates/shipping-info';
import { MailTemplateRepository } from '../../../../src/repositories/mail-template-repository';

describe('ShippingInfoTemplate', () => {
  let templateCreator: ShippingInfoTemplate
  const mailTemplateRepositoryStub = sinon.createStubInstance(MailTemplateRepository);

  beforeEach(() => {
    templateCreator = new ShippingInfoTemplate(mailTemplateRepositoryStub);
  })

  afterEach(() => {
    mailTemplateRepositoryStub.find.reset();
  })

  it('配送先住所のテンプレートが作成できる', async () => {
    mailTemplateRepositoryStub.find.callsFake((_) =>
      Promise.resolve({ template: `\\n$shippingPostCode $shippingPostCode \\n$shippingAddress $shippingAddress \\n$addresseeTel $addresseeTel \\n$addressee $addressee` }));
    const mailTemplate = await templateCreator.construct([{ info: [{ isDelivered: false }, { isDelivered: true }], shippingAddress: { postCode:'0000000', address1: '東京都港区', address2: '品川', phone: '080XXXXXXXX', firstName: '太郎', familyName: '山田' } }])
    assert.equal(mailTemplate, `\n0000000 0000000 \n東京都港区品川 東京都港区品川 \n080XXXXXXXX 080XXXXXXXX \n山田 太郎 山田 太郎`);
  })

  it('配送指定の商品が存在しない場合、配送先住所のテンプレートを作成しない', async () => {
    mailTemplateRepositoryStub.find.callsFake((_) =>
    Promise.resolve({ template: `\\n$shippingPostCode $shippingPostCode \\n$shippingAddress $shippingAddress \\n$addresseeTel $addresseeTel \\n$addressee $addressee` }));
    const mailTemplate = await templateCreator.construct([{ info: [{ isDelivered: false }] }])
    assert.equal(mailTemplate, '');
  })
});
