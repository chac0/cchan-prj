import { AuthService } from './auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

describe('AuthService', () => {

  const email: string = 'email';
  const password: string = 'password';

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        AuthService
      ]
    });
    authStub.authState = of(null);
  });

});
