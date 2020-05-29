import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {of, Subject} from 'rxjs';
​
​
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestore } from '@angular/fire/firestore';
​
import { LoginComponent } from './login.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';
import { NotifyErrorBoxComponent } from '../../components/notify-error-box/notify-error-box.component';
​
import { LoginDocument } from '../../models';
import {LoginDocRepository} from '../../repositories';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../../services/auth.service';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { OverlaySpinnerServiceService } from 'src/app/services/ui/overlay-spinner/overlay-spinner-service.service';
import { NgModule } from '@angular/core';
import { OverlaySpinnerComponent } from 'src/app/components/overlay-spinner/overlay-spinner.component';
​
@NgModule({
  entryComponents: [
    OverlaySpinnerComponent
  ]
})
class TestModule {}
​
import {MatDialogRef} from '@angular/material/dialog';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
​
  let loginDocRepositoryMock: any;
  let loginDocSubject: Subject< LoginDocument[] >;
​
  let newId: string;
​
  const email: string = 'email';
  const password: string = 'password';
​

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(async(() => {
​
    loginDocSubject = new Subject()
    loginDocRepositoryMock = jasmine.createSpyObj('loginDocRepository', ['list', 'create', 'delete']);
    loginDocRepositoryMock.list.and.returnValue(loginDocSubject);
​
    const authStub: any = {
      authState: of(null),
      auth: {
        signInWithEmailAndPassword() {
          return Promise.resolve();
        },
        createUserWithEmailAndPassword(email: string, password) {
          return Promise.resolve();
        }
      }
    };
    
    TestBed.configureTestingModule({
​
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialsModule,
        RouterTestingModule.withRoutes([]),
        TestModule,
        TestModule
      ],
      providers: [
        {provide: LoginDocRepository, useValue: loginDocRepositoryMock},
        {provide: AngularFirestore},
        AuthService,
        {provide: AngularFireAuth, useValue: authStub},
        {provide: MatDialogRef, useValue: {}}
      ],
      declarations: [ LoginComponent, SubHeaderComponent,  NotifyErrorBoxComponent, OverlaySpinnerComponent]
    })
      .compileComponents();
  }));
​
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });
​
  it('インスタンスを生成できる', () => {
    expect(component).toBeTruthy();
  });
​
  it('Emailアドレス は必須です', () => {
    const val = component.form.get('fbemail');
    val.setValue('');
​
    expect(val.hasError('required')).toBe(true);
  });
​
  it('パスワード は必須です', () => {
    const val = component.form.get('fbpwd');
    val.setValue('');
​
    expect(val.hasError('required')).toBe(true);
  });
​
  it('Spinnerが表示される', () => {
    const service = fixture.debugElement.injector.get(OverlaySpinnerServiceService);
    const spyOnShow = spyOn(service, 'show').and.callThrough();
    const email = component.form.get('fbemail');
    email.setValue('test@example.com');
    const password = component.form.get('fbpwd');
    password.setValue('passw0rd');
    fixture.detectChanges();
    component.signIn();
  
    expect(spyOnShow).toHaveBeenCalledTimes(1);
    spyOnShow.calls.reset();
  });
​
  it('登録できる', async () => {
    const service = fixture.debugElement.injector.get(AuthService)
    const spyOnSignUp = spyOn(service, 'SignUp').and.returnValue()
    const email = component.form.get('fbemail');
    email.setValue('test@example.com');
    const password = component.form.get('fbpwd');
    password.setValue('passw0rd');
    fixture.detectChanges();
    component.signUp();
  
    expect(spyOnSignUp).toHaveBeenCalledTimes(1);
    spyOnSignUp.calls.reset();
  });
​
});