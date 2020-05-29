// tslint:disable no-import-side-effect
import 'mocha';
// tslint:enable no-import-side-effect
import * as sinon from 'sinon';
import * as assert from 'power-assert';

import { CreateMailTemplateMediator } from '../../../src/mediators/mail/create-mail-template-mediator'
import { OrderConfirmedTemplate } from '../../../src/mediators/mail/templates/order-confirmed';
import { ShippingInfoTemplate } from '../../../src/mediators/mail/templates/shipping-info';
import { OrderForMail } from '../../../src/models/order';

describe('CreateMailTemplateMediator', () => {
  let templateCreator: CreateMailTemplateMediator

  const orderConfirmedTemplateStub = sinon.createStubInstance(OrderConfirmedTemplate);
  const shippingInfoTemplateStub = sinon.createStubInstance(ShippingInfoTemplate);

  beforeEach(() => {
    templateCreator = new CreateMailTemplateMediator();
    orderConfirmedTemplateStub.construct
      .callsFake((_) => Promise.resolve('orderConfirmedTemplateStub'));
    shippingInfoTemplateStub.construct
      .callsFake((_) => Promise.resolve('shippingInfoTemplateStub'));
  });

  it('forNoticeOfOrderConfirmationメソッドででテンプレートをマージできる', async () => {
    const orders: OrderForMail[] = [];

    const template = await templateCreator.forNoticeOfOrderConfirmation(orders, [orderConfirmedTemplateStub, shippingInfoTemplateStub])
    assert.equal(template, 'orderConfirmedTemplateStubshippingInfoTemplateStub');
  });

  it('forNoticeOfNoStockApologyメソッドででテンプレートをマージできる', async () => {
    const orders: OrderForMail[] = [];

    const template = await templateCreator.forNoticeOfNoStockApology(orders, [orderConfirmedTemplateStub, shippingInfoTemplateStub])
    assert.equal(template, 'orderConfirmedTemplateStubshippingInfoTemplateStub');
  });

  it('forNoticeOfProductReceiptableメソッドでテンプレートをマージできる', async () => {
    const orders: OrderForMail[] = [];
    const template = await templateCreator.forNoticeOfProductReceiptable(orders, [orderConfirmedTemplateStub, shippingInfoTemplateStub])
    assert.equal(template, 'orderConfirmedTemplateStubshippingInfoTemplateStub');
  });
});
