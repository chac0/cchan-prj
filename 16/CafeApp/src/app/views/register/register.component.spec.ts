import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from "rxjs";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Overlay } from '@angular/cdk/overlay';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { By } from '@angular/platform-browser';
import { MatSpinner } from '@angular/material';
import { CommonModule } from '@angular/common';
import { ShopDocRepository } from 'src/app/repositories';
import { ShopDocument } from 'src/app/models';
import { OverlayDialogComponent } from 'src/app/components/overlay-dialog/overlay-dialog.component';

@NgModule({
  imports: [CommonModule],
  entryComponents: [
    MatSpinner,
    OverlayDialogComponent
  ]
})
export class SpinnerModule {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  
  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
	valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
	set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  }
  const FireauthStub: AngularFireAuth = jasmine.createSpyObj('angularFireAuth', ['auth'])
  FireauthStub.auth.createUserWithEmailAndPassword = (email: string, password: string) => {
    return Promise.resolve(null)
  }

  const ShopDocStub: ShopDocRepository = jasmine.createSpyObj('shopDocRepository', ['create'])
  ShopDocStub.create = ({}) => Promise.resolve()

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ RegisterComponent, OverlayDialogComponent ],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: FireauthStub },
        Overlay,
        { provide: ShopDocRepository, useValue: ShopDocStub }
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SpinnerModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('インスタンスを生成できる', () => {
    expect(component).toBeTruthy();
  });

  it('ブランド名 は必須です', () => {
    const val = component.form.get('brandName');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });
  it('ブランド名 は100文字以内です', () => {
    const val = component.form.get('brandName');
    val.setValue('0---+----+1---+----+2---+----+3---+----+4---+----+5---+----+6---+----+7---+----+8---+----+9---+----10');

    expect(val.hasError('maxlength')).toBe(true);
  });

  it('店舗名 は必須です', () => {
    const val = component.form.get('name');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });
  it('店舗名 は100文字以内です', () => {
    const val = component.form.get('name');
    val.setValue('0---+----+1---+----+2---+----+3---+----+4---+----+5---+----+6---+----+7---+----+8---+----+9---+----10');

    expect(val.hasError('maxlength')).toBe(true);
  });
  it('ログインメールアドレス は必須です', () => {
    const val = component.form.get('loginMail');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });
  it('ログインメールアドレス は6文字以上です', () => {
    const val = component.form.get('passWord');
    val.setValue('ABC');

    expect(val.hasError('minlength')).toBe(true);
  });
  it('パスワード は128文字以内です', () => {
    const val = component.form.get('passWord');
    val.setValue('0---+----+1---+----+2---+----+3---+----+4---+----+5---+----+6---+----+7---+----+8---+----+9---+----10---+----11---+----12---+----');

    expect(val.hasError('maxlength')).toBe(true);
  });
  it('パスワード は必須です', () => {
    const val = component.form.get('passWord');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });
  it('電話番号 は必須です', () => {
    const val = component.form.get('phone');
    val.setValue('');

    expect(val.hasError('required')).toBe(true);
  });

  it('正常入力で登録可能になる', () => {

    component.form.get('name').setValue('店舗名（テスト）');
    component.form.get('brandName').setValue('ブランド名（テスト）');
    component.form.get('phone').setValue('09012345678');
    component.form.get('loginMail').setValue('loginMail@mail.co.jp');
    component.form.get('passWord').setValue('password');
    component.form.get('mail1').setValue('mail1@mail.co.jp');
    component.form.get('mail2').setValue('mail2@mail.co.jp');
    component.form.get('mail3').setValue('mail3@mail.co.jp');
    component.form.get('mail4').setValue('mail4@mail.co.jp');
    component.form.get('openYear').setValue(2020);
    component.form.get('openMonth').setValue(1);
    component.form.get('openDay').setValue(1);
    component.form.get('openHour').setValue(9);
    component.form.get('openMin').setValue(0);
    component.form.get('endYear').setValue(2025);
    component.form.get('endMonth').setValue(12);
    component.form.get('endDay').setValue(31);
    component.form.get('endHour').setValue(22);
    component.form.get('endMin').setValue(30);

    expect(component.form.valid).toBe(true);

  });

  
  it('不正な入力で登録できない', () => {

    component.form.get('name').setValue('店舗名（テスト）');
    component.form.get('brandName').setValue('ブランド名（テスト）');
    component.form.get('phone').setValue('09012345678');
    component.form.get('loginMail').setValue('メールアドレス不正');
    component.form.get('passWord').setValue('password');
    component.form.get('mail1').setValue('mail1@mail.co.jp');
    component.form.get('mail2').setValue('mail2@mail.co.jp');
    component.form.get('mail3').setValue('mail3@mail.co.jp');
    component.form.get('mail4').setValue('mail4@mail.co.jp');
    component.form.get('openYear').setValue(2020);
    component.form.get('openMonth').setValue(1);
    component.form.get('openDay').setValue(1);
    component.form.get('openHour').setValue(9);
    component.form.get('openMin').setValue(0);
    component.form.get('endYear').setValue(2025);
    component.form.get('endMonth').setValue(12);
    component.form.get('endDay').setValue(31);
    component.form.get('endHour').setValue(22);
    component.form.get('endMin').setValue(30);

    expect(component.form.valid).toBe(false);
  });

  it('ユーザー登録できる', () => {
    const spyAuth = spyOn(FireauthStub.auth, 'createUserWithEmailAndPassword');

    component.form.get('name').setValue('店舗名（テスト）');
    component.form.get('brandName').setValue('ブランド名（テスト）');
    component.form.get('phone').setValue('09012345678');
    component.form.get('loginMail').setValue('loginMail@mail.co.jp');
    component.form.get('passWord').setValue('password');
    component.form.get('mail1').setValue('mail1@mail.co.jp');
    component.form.get('mail2').setValue('mail2@mail.co.jp');
    component.form.get('mail3').setValue('mail3@mail.co.jp');
    component.form.get('mail4').setValue('mail4@mail.co.jp');
    component.form.get('openYear').setValue(2020);
    component.form.get('openMonth').setValue(1);
    component.form.get('openDay').setValue(1);
    component.form.get('openHour').setValue(9);
    component.form.get('openMin').setValue(0);
    component.form.get('endYear').setValue(2025);
    component.form.get('endMonth').setValue(12);
    component.form.get('endDay').setValue(31);
    component.form.get('endHour').setValue(22);
    component.form.get('endMin').setValue(30);
    
    component.onSubmit(new Event('click'));
    fixture.detectChanges();

    expect(FireauthStub.auth.createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    spyAuth.calls.reset();

  })

});
