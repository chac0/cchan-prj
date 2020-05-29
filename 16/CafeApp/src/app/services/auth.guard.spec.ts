import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
​
describe('AuthGuard', () => {
  let injector: TestBed;
  let service: AuthGuard;
  let router: Router;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  const authStub: any = {
    authState: of(null)
  }
  class MockRouter {
    navigate(path: any[]) {
      return Promise.resolve(true)
    }
  }
​
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthGuard,
        AuthService,
        {provide: AngularFireAuth, useValue: authStub},
        {provide: Router, useValue: new MockRouter()},
        {provide: AngularFirestore},
      ],
    });
​
    injector = getTestBed();
    service = injector.get(AuthGuard);
    router = injector.get(Router);
    httpMock = injector.get(HttpTestingController);
    authService = injector.get(AuthService);
    authService.userData = of(null);
  });
​
  afterEach(() => {
    httpMock.verify();
  });
​
  it('遷移できない', () => {
    const spyOnRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    const result: Observable<boolean> = service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>
    result.subscribe((it) => {
      expect(spyOnRouter).toHaveBeenCalled()
    })
    spyOnRouter.calls.reset()
  })
});