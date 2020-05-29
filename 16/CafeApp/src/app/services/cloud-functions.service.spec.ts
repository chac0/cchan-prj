import { TestBed } from '@angular/core/testing';

import { CloudFunctionsService } from './cloud-functions.service';
import { AngularFireFunctions } from '@angular/fire/functions';

describe('CloudFunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AngularFireFunctions }
    ]
  }));

  it('should be created', () => {
    const service: CloudFunctionsService = TestBed.get(CloudFunctionsService);
    expect(service).toBeTruthy();
  });
});
