import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {

  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[LocalStorageService]
    });

    service = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });
});
