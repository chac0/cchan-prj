import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from './order-list.component';
import { SubHeaderComponent } from '../../components/sub-header/sub-header.component';

import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth.service';
import {of, Observable} from 'rxjs';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { OrderListItemComponent } from 'src/app/components/order-list-item/order-list-item.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OrderService } from 'src/app/services/order.service';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { ShopDocument, DisplayedOrderDocument } from 'src/app/models';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderInfoListItemComponent } from 'src/app/components/order-info-list-item/order-info-list-item.component';
import { EitherPipe } from 'src/app/pipes/either.pipe';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  const authStub: any = {
    authState: {},
    auth: {
      signInWithEmailAndPassword() {
        return Promise.resolve();
      }
    }
  };

  const orders: Observable<DisplayedOrderDocument[]> = of([{
        "createdAt": "20191216T100000+0900",
        "id": "001",
        "info": [{
          "productId": "p_0",
          "price": 4000,
          "amount": 10,
          "subTotal": 4000,
          "isCanceled": true,
          "productName": "菊丸ラーメン",
          "brandName": "ブランドー",
          "status": "none",
          "imagePath$": of(""),
          "isDelivered": true
        }, {
          "productId": "p_1",
          "price": 1500,
          "amount": 5,
          "subTotal": 1500,
          "isCanceled": false,
          "productName": "海老蔵うどん",
          "brandName": "ブランドー",
          "status": "accepted",
          "imagePath$": of(""),
          "isDelivered": true
        }],
        "orderId": "2020-01-25-001",
        "shopId": "shop_000",
        "total": 10,
        "userId": "user_0",
        "userName": "山田 太郎",
        "shippingAddress": {
          "address1": "東京都品川区",
          "address2": "大崎",
          "address3": "",
          "familyName": "大崎",
          "firstName": "太郎",
          "id": "",
          "familyNameKana": "",
          "firstNameKana": "",
          "phone": "",
          "postCode": "",
          "updatedAt": "",
          "createdAt": ""
        }
      },
      {
        "createdAt": "20191216T101000+0900",
        "id": "000",
        "info": [{
          "productId": "p_0",
          "price": 4000,
          "amount": 10,
          "subTotal": 4000,
          "isCanceled": false,
          "productName": "菊丸ラーメン",
          "brandName": "ブランドー",
          "status": "none",
          "imagePath$": of(""),
          "isDelivered": true
        }, {
          "productId": "p_1",
          "price": 1500,
          "amount": 5,
          "subTotal": 1500,
          "isCanceled": false,
          "productName": "海老蔵うどん",
          "brandName": "ブランドー",
          "status": "none",
          "imagePath$": of(""),
          "isDelivered": true
        }],
        "orderId": "2020-01-25-001",
        "shopId": "shop_000",
        "total": 10,
        "userId": "user_0",
        "userName": "山田 太郎",
        "shippingAddress": {
          "address1": "東京都品川区",
          "address2": "大崎",
          "address3": "",
          "familyName": "大崎",
          "firstName": "太郎",
          "id": "",
          "familyNameKana": "",
          "firstNameKana": "",
          "phone": "",
          "postCode": "",
          "updatedAt": "",
          "createdAt": ""
        }
      }])

  // @ts-ignore
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
  };

  const localStorageServiceStub: LocalStorageService = jasmine.createSpyObj('localStorageService', ['getShopDocument', 'shopDocument'])
  localStorageServiceStub.getShopDocument = () => shopSample
  localStorageServiceStub.shopDocument = shopSample

  const orderServiceStub: OrderService = jasmine.createSpyObj('orderService', ['findAllShopOrdersByShopId'])
  orderServiceStub.findAllShopOrdersByShopId = (shopId: string) => orders

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      
      imports: [
        RouterTestingModule.withRoutes([]),
        MaterialsModule,
        ScrollingModule,
        FormsModule
      ],

      providers: [
        {provide: AngularFireAuth, useValue: authStub},
        {provide: AngularFirestore},
        {provide: OrderService, useValue: orderServiceStub},
        {provide: LocalStorageService, useValue: localStorageServiceStub},
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ],

      declarations: [
        OrderListComponent,
        SubHeaderComponent,
        OrderListItemComponent,
        OrderInfoListItemComponent,
        ImageLoaderDirective,
        EitherPipe
      ]
    })
    .compileComponents();
  }));
  authStub.authState = of(null);

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('日付で昇順になっているか', () => {
    component.orderList$.subscribe((it) => {
      expect(it[0].id).toEqual('000')
    })
  })

  it('「1件の注文が完了していません」という注釈が出ているか', () => {
    component.unconfirmedOrderList$.subscribe((it) => {
      expect(it.length).toEqual(1)
    })
  })
});
