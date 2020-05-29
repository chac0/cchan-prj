import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { OrderDocRepository, ProductInfoDocRepository, UserDocRepository } from '../repositories';
import { of, Observable } from 'rxjs';
import { OrderDocument, ProductInfoDocument, DisplayedOrderDocument } from '../models';
import { UserDocument } from '../models/user';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';

describe('OrderService', () => {
  const orderDoc: OrderDocument = {
    "orderId": "2020-01-25-001",
    "id": "001",
    "userId": "user_0",
    "shopId": "shop_000",
    "info": [{
      "productId": "p_0",
      "price": 4000,
      "amount": 10,
      "subTotal": 4000,
      "isCanceled": false,
      "status": "none",
      "isDelivered": true
    }, {
      "productId": "p_1",
      "price": 1500,
      "amount": 5,
      "subTotal": 1500,
      "isCanceled": false,
      "status": "none",
      "isDelivered": true
    }],
    "total": 10,
    "createdAt": "20191216T100000+0900",
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
  }

  const products: Omit<ProductInfoDocument, 'ToRowStr'>[] = [{
    "id": "p_0",
    "name": "菊丸ラーメン",
    "brandName": "ブランドー",
    "price": "400",
    "priceType": "",
    "shopId": "shop_000",
    "vat": 20,
    "stock": 150,
    "imagePath": "",
    "productUrl": "",
    "createdAt": "20191216T100000+0900",
    "updatedAt": "20191216T100000+0900",
    "isDeliverable": true,
    "ubiregiAccountId": "",
    "ubiregiId": "",
    "imageUrl": ""
  }, {
    "id": "p_1",
    "name": "海老蔵うどん",
    "brandName": "ブランドー",
    "price": "300",
    "priceType": "",
    "vat": 20,
    "stock": 78,
    "shopId": "shop_000",
    "imagePath": "",
    "productUrl": "",
    "createdAt": "20191216T100000+0900",
    "updatedAt": "20191216T100000+0900",
    "isDeliverable": true,
    "ubiregiAccountId": "",
    "ubiregiId": "",
    "imageUrl": ""
  },{
    "id": "p_2",
    "name": "平塚そば",
    "brandName": "ブランドー",
    "price": "500",
    "priceType": "",
    "vat": 20,
    "stock": 56,
    "shopId": "shop_000",
    "imagePath": "",
    "productUrl": "",
    "createdAt": "20191216T100000+0900",
    "updatedAt": "20191216T100000+0900",
    "isDeliverable": true,
    "ubiregiAccountId": "",
    "ubiregiId": "",
    "imageUrl": ""
  },{
    "id": "p_3",
    "name": "佐野らぁめん",
    "brandName": "ブランドー",
    "price": "600",
    "priceType": "",
    "vat": 20,
    "stock": 89,
    "shopId": "shop_001",
    "imagePath": "",
    "productUrl": "",
    "createdAt": "20191216T100000+0900",
    "updatedAt": "20191216T100000+0900",
    "isDeliverable": true,
    "ubiregiAccountId": "",
    "ubiregiId": "",
    "imageUrl": ""
  },{
    "id": "p_4",
    "name": "喜多方ラーメン",
    "brandName": "ブランドー",
    "price": "800",
    "priceType": "",
    "vat": 20,
    "stock": 45,
    "shopId": "shop_001",
    "imagePath": "",
    "productUrl": "",
    "createdAt": "20191216T100000+0900",
    "updatedAt": "20191216T100000+0900",
    "isDeliverable": true,
    "ubiregiAccountId": "",
    "ubiregiId": "",
    "imageUrl": ""
  }];

  const users: UserDocument[] = [
    {
			"id": "user_0",
			"stripeId": "stirpeid_user_0",
			"familyName": "山田",
			"firstName": "太郎",
			"familyNameKana": "ヤマダ",
			"firstNameKana": "タロウ",
			"birthDate": "1990-01-01",
			"gender": "MALE",
      "phone": "09088887777",
      "email": "",
			"createdAt": "20191216T100000+0900",
      "updatedAt": "20191216T100000+0900",
      "authenticated": true,
    },
    {
			"id": "user_1",
			"stripeId": "stirpeid_user_1",
			"familyName": "佐藤",
			"firstName": "花子",
			"familyNameKana": "サトウ",
			"firstNameKana": "ハナコ",
			"birthDate": "1986-01-01",
			"gender": "FEMALE",
      "phone": "09088885555",
      "email": "",
			"createdAt": "20191216T100000+0900",
      "updatedAt": "20191216T100000+0900",
      "authenticated": true,
    },
    {
			"id": "user_2",
			"stripeId": "stirpeid_user_1",
			"familyName": "斎藤",
			"firstName": "薫",
			"familyNameKana": "サイトウ",
			"firstNameKana": "カヲル",
			"birthDate": "1960-12-24",
			"gender": "OTHER",
      "phone": "09088886666",
      "email": "",
			"createdAt": "20191216T100000+0900",
      "updatedAt": "20191216T100000+0900",
      "authenticated": true,
		}
  ]

  const imagePathMock$ = of('');

  beforeEach(() => {
    const orderRepositryStub: OrderDocRepository = jasmine.createSpyObj('orderRepositry', ['findAllByShopId']);
    orderRepositryStub.findAllByShopId = (shopId: string) => of([orderDoc].filter((it) => it.shopId === shopId));

    const productRepositoryStub: ProductInfoDocRepository = jasmine.createSpyObj('productRepository', ['getList']);
    productRepositoryStub.getList = (shopId: string) => of(products) as Observable<ProductInfoDocument[]>;


    const userRepositoryStub: UserDocRepository = jasmine.createSpyObj('userRepository', ['findAll']);
    userRepositoryStub.findAll = () => of(users);

    // @ts-ignore
    const angularFireStorageStub: AngularFireStorage = {
      ref: (path: string) => {
        return { getDownloadURL: () => imagePathMock$ } as AngularFireStorageReference
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OrderDocRepository, useValue: orderRepositryStub },
        { provide: ProductInfoDocRepository, useValue: productRepositoryStub },
        { provide: UserDocRepository, useValue: userRepositoryStub },
        { provide: AngularFireStorage, useValue: angularFireStorageStub },
        OrderService
      ]
    });
  });

  it('should be created', () => {
    const service: OrderService = TestBed.get(OrderService);
    expect(service).toBeTruthy();
  });

  it('findAllShopOrdersByShopIdで取得できる値が正しい', () => {
    const result: DisplayedOrderDocument = {
      "createdAt": "20191216T100000+0900",
      "id": "001",
      "info": [{
        "productId": "p_0",
        "price": 4000,
        "amount": 10,
        "subTotal": 4000,
        "isCanceled": false,
        "productName": "菊丸ラーメン",
        "brandName": "ブランドー",
        "status": "none",
        "imagePath$": imagePathMock$,
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
        "imagePath$": imagePathMock$,
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
    }

    const service: OrderService = TestBed.get(OrderService);
    console.log(typeof service.findAllShopOrdersByShopId)
    service.findAllShopOrdersByShopId("shop_000").subscribe((it) => {
      expect(it.length).toEqual(1)
      expect(it[0]).toEqual(result)
    })
  });
});
