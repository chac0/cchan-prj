/*tslint:disable:no-import-side-effect*/
import 'mocha';
import * as assert from 'power-assert';

import { InjectMailTemplateCreators } from '../../src/decorators/inject-mail-template-creators'
import { MailTemplateCreator } from '../../src/mediators/mail/types'
import { Order } from '../../src/models/order';
import { MailTemplateRepository } from '../../src/repositories/mail-template-repository';
import { Inject } from '../../src/decorators/inject';

@Inject()
class MockMailTemplateCreator implements MailTemplateCreator {
  constructor(private _repository: MailTemplateRepository) {}
  public async construct(orders: Order[]) {
    return Promise.resolve('template');
  }

  get repository() {
    return this._repository
  }
}

class Mediator {
  creator?: MockMailTemplateCreator
  @InjectMailTemplateCreators([MockMailTemplateCreator])
  async create(orders: Order[], templates?: MailTemplateCreator[]) {
    const template = await Promise.all(templates!.map((it) => it.construct(orders)))
    this.creator = templates![0] as MockMailTemplateCreator
    return template.reduce((pre, curr) => pre + curr)
  }

  get repository() {
    return this.creator!.repository
  }
}

describe('InjectMailTemplateCreators', () => {
  
  it('指定されたクラスをインジェクトできる', async () => {
    const mediator = new Mediator();
    const template = await mediator.create([{}] as Order[]);
    assert.equal(template, 'template');
    assert.equal(mediator.repository instanceof MailTemplateRepository, true)
  })
})
