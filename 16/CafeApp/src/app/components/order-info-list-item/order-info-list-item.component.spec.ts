import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInfoListItemComponent } from './order-info-list-item.component';
import { OrderListItemComponent } from '../order-list-item/order-list-item.component';
import { ImageLoaderDirective } from 'src/app/directives/image-loader.directive';
import { EitherPipe } from 'src/app/pipes/either.pipe';
import { MaterialsModule } from 'src/app/materials/materials.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DisplayedOrderInfoDocument } from 'src/app/models';
import { of } from 'rxjs';

describe('OrderInfoListItemComponent', () => {
  let component: OrderInfoListItemComponent;
  let fixture: ComponentFixture<OrderInfoListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListItemComponent, OrderInfoListItemComponent, ImageLoaderDirective, EitherPipe ],
      imports: [
        MaterialsModule,
        ScrollingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInfoListItemComponent);
    component = fixture.componentInstance;
    component.orderInfo = {
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
    } as DisplayedOrderInfoDocument
    component.isOrderConfirmed = false

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('キャンセルボタン押下時にEventEmitが発火している', () => {
    const spyCancel = spyOn(component.changeOrderStatus, 'emit');
    const debugElement = fixture.debugElement;
    const toggleButton = debugElement.query(By.css('#cancel'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    expect(spyCancel).toHaveBeenCalledWith({ action: 'cancel', productId: 'p_0' });
    spyCancel.calls.reset();
  });

  it('受注ボタン押下時にEventEmitが発火している', () => {
    const spyReceiveAnOrder = spyOn(component.changeOrderStatus, 'emit');
    const debugElement = fixture.debugElement;
    const toggleButton = debugElement.query(By.css('#receiveAnOrder'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    expect(spyReceiveAnOrder).toHaveBeenCalledWith({ action: 'receiveAnOrder', productId: 'p_0' });
    spyReceiveAnOrder.calls.reset();
  });

  it('isOrderConfirmedがtrueの時にキャンセルボタン押下してもEventEmitterが発火しない', () => {
    component.isOrderConfirmed = true
    const spyCancel = spyOn(component.changeOrderStatus, 'emit');
    const debugElement = fixture.debugElement;
    const toggleButton = debugElement.query(By.css('#cancel'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    expect(spyCancel).not.toHaveBeenCalledWith({ action: 'cancel', productId: 'p_0' });
    spyCancel.calls.reset();
  });

  it('isOrderConfirmedがtrueの時に受注ボタン押下してもEventEmitterが発火しない', () => {
    component.isOrderConfirmed = true;
    const spyReceiveAnOrder = spyOn(component.changeOrderStatus, 'emit');
    const debugElement = fixture.debugElement;
    const toggleButton = debugElement.query(By.css('#receiveAnOrder'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();

    expect(spyReceiveAnOrder).not.toHaveBeenCalledWith({ action: 'receiveAnOrder', productId: 'p_0' });
    spyReceiveAnOrder.calls.reset();
  });

  it('トグルボタンが何も選択されていない', () => {
    expect(component.toggleStatus).toBeUndefined();
  });

  it('トグルボタンが「キャンセル」を選択している', () => {
    component.orderInfo = {
      "productId": "p_0",
      "price": 4000,
      "amount": 10,
      "subTotal": 4000,
      "isCanceled": true,
      "productName": "菊丸ラーメン",
      "brandName": "ブランドー",
      "imagePath$": of(""),
      "status": "none",
      "isDelivered": true
    } as DisplayedOrderInfoDocument
    expect(component.toggleStatus).toEqual('cancel');
  });

  it('トグルボタンが「受注する」を選択している', () => {
    component.orderInfo = {
      "productId": "p_0",
      "price": 4000,
      "amount": 10,
      "subTotal": 4000,
      "isCanceled": false,
      "productName": "菊丸ラーメン",
      "brandName": "ブランドー",
      "imagePath$": of(""),
      "status": "accepted",
      "isDelivered": true
    } as DisplayedOrderInfoDocument
    expect(component.toggleStatus).toEqual('receiveAnOrder');
  });
});
