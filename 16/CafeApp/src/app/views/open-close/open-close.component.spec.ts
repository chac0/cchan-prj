import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { OpenCloseComponent } from './open-close.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShopDocument } from 'src/app/models';
import { ShopDocRepository } from 'src/app/repositories';

import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth.service';
import {of} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaterialsModule } from 'src/app/materials/materials.module';

describe('OpenCloseComponent', () => {
  let component: OpenCloseComponent;
  let fixture: ComponentFixture<OpenCloseComponent>;
  let shopDocRepositoryMock: any;
  let localStorageServiceMock: any;
  let shopDocSubject: Subject<ShopDocument[]>;
  const shopSample: ShopDocument = {
    id: 'shop_000',
    createdAt: '',
    updatedAt: '',
    closedDate: '',
    closedTime: '',
    openDate: '',
    openTime: '',
    isOpened: false,
    mails: [],
    loginMail: '',
    name: '',
    phone: '',
    imagePath: '',
    brandName: '',
  };

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  beforeEach(async(() => {
    shopDocSubject = new Subject();
    shopDocRepositoryMock = jasmine.createSpyObj('shopDocRepository', ['findById', 'update']);
    shopDocRepositoryMock.findById.and.returnValue(shopDocSubject);
    localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getShopDocument']);
    localStorageServiceMock.getShopDocument.and.returnValue({ id: 'shop_000' });

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [OpenCloseComponent, SubHeaderComponent],
      providers: [
        { provide: ShopDocRepository, useValue: shopDocRepositoryMock },
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        {provide: LocalStorageService, useValue: localStorageServiceMock},
        AuthService
      ],
    })
      .compileComponents();
  }));
  authStub.authState = of(null);

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('インスタンスを生成できる', () => {
    expect(component).toBeTruthy();
  });

  it('設定が閉店のときの初期化処理', () => {
    // deep copy
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['initialize'](shop);
    expect(component['currentState']).toEqual('閉店');
    expect(component['selectedState']).toEqual(0);
    expect(component['canSubmit']).toEqual(false);

  });
  it('設定が開店のときの初期化処理', () => {
    // deep copy
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['initialize'](shop);
    shop['isOpened'] = true;
    component['initialize'](shop);
    expect(component['currentState']).toEqual('開店');
    expect(component['selectedState']).toEqual(1);
    expect(component['canSubmit']).toEqual(false);
  });

  it('IDから店舗情報を取得できる', () => {
    shopDocSubject.next([]);
    expect(shopDocRepositoryMock.findById).toHaveBeenCalled();
  });

  it('ラジオボタンが閉店から開店に変わったときは更新できる', () => {
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['shop'] = shop;
    component['selectedState'] = 1;
    component['onChangeState']();
    expect(component['canSubmit']).toEqual(true);

  });
  it('ラジオボタンが開店から閉店に変わったときは更新できる', () => {
    const shop = JSON.parse(JSON.stringify(shopSample));
    shop['isOpened'] = true;
    component['shop'] = shop;
    component['selectedState'] = 0;
    component['onChangeState']();
    expect(component['canSubmit']).toEqual(true);

  });
  it('ラジオボタンが開店から変わらないときは更新できない', () => {
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['shop'] = shop;
    shop['isOpened'] = true;
    component['selectedState'] = 1;
    component['onChangeState']();
    expect(component['canSubmit']).toEqual(false);
  });

  it('非活性の更新ボタンを押しても何も起こらない', () => {
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['shop'] = shop;
    component['selectedState'] = 1;
    component['canSubmit'] = false;
    component['submit']();
    expect(component['shop']['isOpened']).toEqual(false);
  });

  it('活性時の更新ボタンを押すと更新できる', () => {
    const shop = JSON.parse(JSON.stringify(shopSample));
    component['shop'] = shop;
    component['selectedState'] = 1;
    component['canSubmit'] = true;
    component['submit']();
    expect(component['shop']['isOpened']).toEqual(true);
  });

});
