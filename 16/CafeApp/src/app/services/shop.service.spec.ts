import { TestBed } from '@angular/core/testing';

import { ShopService } from './shop.service';
import { ShopDocument } from '../models';

describe('ShopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopService = TestBed.get(ShopService);
    expect(service).toBeTruthy();
  });

  it('onNotifySharedDataChangedをCallした場合、新しいデータをSubscribeできているか', () => {
    const service: ShopService = TestBed.get(ShopService);
    service.onNotifySharedDataChanged(new ShopDocument());
    service.shopData$.subscribe((it) => {
      expect(it).toEqual(new ShopDocument())
    })
  })
});
