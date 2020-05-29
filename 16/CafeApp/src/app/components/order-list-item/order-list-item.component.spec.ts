import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListItemComponent } from './order-list-item.component';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { OrderInfoListItemComponent } from '../order-info-list-item/order-info-list-item.component';
import { EitherPipe } from 'src/app/pipes/either.pipe';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { DisplayedOrderDocument, OrderDocument } from 'src/app/models';
import { SimpleChanges, SimpleChange, NgModule } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Observable, throwError } from 'rxjs';
import { OrderDocRepository } from 'src/app/repositories';
import { OverlaySpinnerServiceService } from 'src/app/services/ui/overlay-spinner/overlay-spinner-service.service';
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';
import { OverlaySpinnerComponent } from '../overlay-spinner/overlay-spinner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayDialogComponent } from '../overlay-dialog/overlay-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { OrderMapper } from 'src/app/mappers/order-mapper';

@NgModule({
  entryComponents: [
    OverlaySpinnerComponent,
    OverlayDialogComponent
  ]
})
class TestModule {}

describe('OrderListItemComponent', () => {
  let component: OrderListItemComponent;
  let fixture: ComponentFixture<OrderListItemComponent>;

  //@ts-ignore
  const cloudFunctionsServiceStub: CloudFunctionsService = { payAnOrder: ({}) => of({ id: '', orderId: '', userId: '', shopId: '', info: [] }) as Observable<OrderDocument> };
  const overlaySpinnerServiceStub: OverlaySpinnerServiceService = jasmine.createSpyObj('overlaySpinnerService', ['show', 'hide']);
  const showMock = jasmine.createSpy('show').and.returnValue(undefined);
  const hideMock = jasmine.createSpy('hide').and.returnValue(undefined);
  overlaySpinnerServiceStub.show = showMock;
  overlaySpinnerServiceStub.hide = hideMock;
  const orderRepositoryStub: OrderDocRepository = jasmine.createSpyObj('orderRepository', ['update']);
  const updateMock = jasmine.createSpy('update').and.returnValue(Promise.resolve());
  orderRepositoryStub.update = updateMock;

  const openMock = jasmine.createSpy('open').and.returnValue(({ afterClosed: () => of(''), close: (result?: any) => undefined }) as MatDialogRef<any, any>);
  //@ts-ignore
  const matDialogStub: MatDialog = { open: (component: any) => openMock, closeAll: () => undefined };

  const initOrder: DisplayedOrderDocument = {
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
      "imagePath$": of(""),
      "status": "none",
      "isDelivered": true
    }, {
      "productId": "p_1",
      "price": 1500,
      "amount": 5,
      "subTotal": 1500,
      "isCanceled": false,
      "productName": "海老蔵うどん",
      "brandName": "ブランドー",
      "imagePath$": of(""),
      "status": "none",
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderListItemComponent,
        OrderInfoListItemComponent,
        OverlaySpinnerComponent,
        OverlayDialogComponent,
        ImageLoaderDirective,
        EitherPipe
      ],
      imports: [
        MaterialsModule,
        ScrollingModule,
        FormsModule,
        TestModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AngularFirestore },
        { provide: OrderDocRepository, useValue: orderRepositoryStub },
        { provide: OverlaySpinnerServiceService, useValue: overlaySpinnerServiceStub },
        { provide: CloudFunctionsService, useValue: cloudFunctionsServiceStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: MatDialogRef, useValue: { afterClosed: () => of('') } as MatDialogRef<any, any> }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListItemComponent);
    component = fixture.componentInstance;
    component.order = initOrder;
    fixture.detectChanges();
    component.ngOnChanges({
      order: { currentValue: initOrder, previousValue: undefined, firstChange: true } as SimpleChange,
      other: { currentValue: 0, previousValue: undefined, firstChange: true } as SimpleChange });
    fixture.detectChanges();
  });

  afterEach(() => {
    updateMock.calls.reset();
    showMock.calls.reset();
    hideMock.calls.reset();
    openMock.calls.reset();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Inputデータが変更された場合、Component内のデータが変更されている', () => {
    const newOrder: DisplayedOrderDocument = {
      "createdAt": "20191216T100000+0900",
      "id": "002",
      "info": [{
        "productId": "p_4",
        "price": 1500,
        "amount": 5,
        "subTotal": 1500,
        "isCanceled": false,
        "productName": "海老蔵うどん",
        "brandName": "ブランドー",
        "imagePath$": of(""),
        "status": "none",
        "isDelivered": false
      }],
      "orderId": "2020-01-25-001",
      "shopId": "shop_000",
      "total": 10,
      "userId": "user_1",
      "userName": "山田 次郎",
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
    };

    const orderChanges = { previousValue: initOrder, currentValue: newOrder, firstChange: false } as SimpleChange;
    const otherChanges = { previousValue: 0, currentValue: 1, firstChange: false } as SimpleChange;
    component.ngOnChanges({ order: orderChanges, other: otherChanges } as SimpleChanges);
    fixture.detectChanges();

    expect(component.orderInfo.length).toEqual(1);
    expect(component.orderInfo[0].productId).toEqual('p_4');
    expect(component.isDefault).toBeTruthy();
    expect(component.hasDeliveredProduct).toBeFalsy();
  });

  it('order以外のInputデータが更新された場合、orderのデータは何も変更されていない', () => {
    component.ngOnChanges({
      order: { previousValue: initOrder, currentValue: undefined, firstChange: false } as SimpleChange,
      other: { previousValue: 0, currentValue: 1, firstChange: false } as SimpleChange
    });
    fixture.detectChanges();

    expect(component.orderInfo).toEqual(initOrder.info);
  });

  it('キャンセルボタンが押された場合、OrderInfoはキャンセル扱いになっている', () => {
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_0' });
    fixture.detectChanges();
    expect(component.orderInfo[0].isCanceled).toBeTruthy();
    expect(component.orderInfo[0].status).toEqual('none');
  });

  it('受注ボタンが押された場合、OrderInfoは受注扱いになっている', () => {
    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_0' });
    fixture.detectChanges();
    expect(component.orderInfo[0].isCanceled).toBeFalsy();
    expect(component.orderInfo[0].status).toEqual('accepted');
  });

  it('全てのOrderInfoについて選択した場合、ボタンが活性化される', () => {

    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_1' });
    fixture.detectChanges();
    expect(component.isOrderConfirmed).toBeFalsy();
  });

  it('注文確認ダイアログではいかいいえを選択しないと処理が呼ばれない', () => {
    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_1' });
    fixture.detectChanges();

    const executeIfOkMock = jasmine.createSpy('executeIfOk').and.returnValue(undefined);
    component['executeIfOk'] = executeIfOkMock;
    
    const debugElement = fixture.debugElement;
    debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(executeIfOkMock).not.toHaveBeenCalled();

    executeIfOkMock.calls.reset();
  });

  it('受注確認ダイアログでキャンセルボタンを押下した際、データが更新されない', () => {
    const repository: OrderDocRepository = TestBed.get(OrderDocRepository);

    component['executeIfOk']('キャンセル');
    fixture.detectChanges();

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('商品が全て在庫なしのため、キャンセルすると決算処理が呼ばれない', () => {
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_1' });
    fixture.detectChanges();

    const updateOrderAsObservableMock = jasmine.createSpy('updateOrderAsObserbable').and.returnValue(of(undefined));
    component['updateOrderAsObservable'] = updateOrderAsObservableMock;
    const executePaymentMock = jasmine.createSpy('executePayment').and.returnValue(undefined);
    component['executePayment'] = executePaymentMock;
    fixture.detectChanges();

    component['executeIfOk']('はい');
    fixture.detectChanges();

    expect(updateOrderAsObservableMock).toHaveBeenCalled();
    expect(executePaymentMock).not.toHaveBeenCalled();
    
    updateOrderAsObservableMock.calls.reset();
    executePaymentMock.calls.reset();
  });

  it('1件でも在庫があった場合、決算処理とStatus更新処理をする', () => {
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_1' });
    fixture.detectChanges();

    const executeUpdateOrderMock = jasmine.createSpy('executeUpdateOrder').and.returnValue(of({ id: '2020-01-01-001', info: [{ productId: 'p_0', status: 'accepted', isCanceled: false }] }));
    component['executeUpdateOrder'] = executeUpdateOrderMock;
    const executePaymentMock = jasmine.createSpy('executePayment').and.returnValue(of({}));
    component['executePayment'] = executePaymentMock;

    component['executeIfOk']('はい');
    fixture.detectChanges();

    expect(executeUpdateOrderMock).toHaveBeenCalledTimes(2);
    expect(executePaymentMock).toHaveBeenCalled();
    expect(hideMock).toHaveBeenCalled();

    executePaymentMock.calls.reset();
    executeUpdateOrderMock.calls.reset();
  });

  it('決済処理でエラーになった場合、エラーダイアログが表示され、それ以降の処理は走らない', () => {
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_1' });
    fixture.detectChanges();

    const updateOrderAsObservableMock = jasmine.createSpy('updateOrderAsObserbable').and.returnValue(of(undefined));
    component['updateOrderAsObservable'] = updateOrderAsObservableMock;
    const service: CloudFunctionsService = TestBed.get(CloudFunctionsService);
    service.payAnOrder = (_) => throwError(new Error('error'));

    component['executeIfOk']('はい');
    fixture.detectChanges();

    expect(updateOrderAsObservableMock).toHaveBeenCalledTimes(1);
    expect(hideMock).toHaveBeenCalled();

    updateOrderAsObservableMock.calls.reset();
  });

  it('注文更新処理でエラーになった場合、エラーダイアログが表示され、それ以降の処理は走らない', () => {
    component.onOrderStatusChanged({ action: 'cancel', productId: 'p_0' });
    fixture.detectChanges();
    component.onOrderStatusChanged({ action: 'receiveAnOrder', productId: 'p_1' });
    fixture.detectChanges();

    const updateOrderAsObserbableMock = jasmine.createSpy('updateOrderAsObserbable').and.returnValue(throwError(new Error('error')));
    component['updateOrderAsObservable'] = updateOrderAsObserbableMock;

    component['executeIfOk']('はい');
    fixture.detectChanges();

    expect(hideMock).toHaveBeenCalled();

    updateOrderAsObserbableMock.calls.reset();
  });
  
  it('全ての注文の更新処理を行う', async () => {
    const orderInfo1 = { ...initOrder.info[0], isCanceled: true };
    const orderInfo2 = { ...initOrder.info[1], status: 'accepted' };
    const orderInfo = [orderInfo1, orderInfo2];
    const order = { ...initOrder, info: orderInfo };
    const updateMock = jasmine.createSpy('update').and.returnValue(Promise.resolve());
    const repository: OrderDocRepository = TestBed.get(OrderDocRepository);
    repository.update = updateMock;

    await component['executeUpdateOrder'](new OrderMapper().onOrderConfirmed, order);
    
    const args: OrderDocument = updateMock.calls.mostRecent().args[0];
    expect(args.id).toEqual(order.id);
    expect(args.info[0].isCanceled).toBeTruthy();
    expect(args.info[1].status).toEqual('accepted');
    updateMock.calls.reset();
  });

  it('statusがacceptedになった注文の更新処理を行う', async () => {
    const orderInfo1 = { ...initOrder.info[0], isCanceled: true };
    const orderInfo2 = { ...initOrder.info[1], status: 'accepted' };
    const orderInfo = [orderInfo1, orderInfo2];
    const order = { ...initOrder, info: orderInfo };
    const updateMock = jasmine.createSpy('update').and.returnValue(Promise.resolve());
    const repository: OrderDocRepository = TestBed.get(OrderDocRepository);
    repository.update = updateMock;

    await component['executeUpdateOrder'](new OrderMapper().onPaymentCompleted, order);

    const args: OrderDocument = updateMock.calls.mostRecent().args[0];
    expect(args.id).toEqual(order.id);
    expect(args.info[1].status).toEqual('payment');
    expect(args.info.length).toEqual(2);

    updateMock.calls.reset();
  });

  it('executePaymentが正常終了した場合、argsに追加したorderと同じデータが戻り値として取得できるか', () => {
    const service: CloudFunctionsService = TestBed.get(CloudFunctionsService);
    service.payAnOrder = (_) => of({ } as OrderDocument);

    component['executePayment'](initOrder)
      .subscribe((order) => {
        expect(order).toEqual(initOrder)
      })
  })
});
