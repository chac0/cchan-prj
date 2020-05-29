import { TestBed } from '@angular/core/testing';

import { SendMailService } from './send-mail.service';
import { AngularFireFunctions } from '@angular/fire/functions';

describe('SendMailService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AngularFireFunctions }
    ]
  }));

  it('should be created', () => {
    const service: SendMailService = TestBed.get(SendMailService);
    expect(service).toBeTruthy();
  });
});
