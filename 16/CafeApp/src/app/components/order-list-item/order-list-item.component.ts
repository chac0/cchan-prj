import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { DisplayedOrderDocument, DisplayedOrderInfoDocument, OrderDocument, OrderInfoDocument } from 'src/app/models';
import { OrderDocRepository } from 'src/app/repositories';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, from, of } from 'rxjs';
import { OverlayDialogComponent, DialogData } from '../overlay-dialog/overlay-dialog.component';
import { CloudFunctionsService } from 'src/app/services/cloud-functions.service';
import { OverlaySpinnerServiceService } from 'src/app/services/ui/overlay-spinner/overlay-spinner-service.service';
import { first, catchError, tap, map, switchMap, filter } from 'rxjs/operators';
import { OrderMapper } from 'src/app/mappers/order-mapper';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListItemComponent implements OnInit, OnChanges {
  @Input() order!: DisplayedOrderDocument

  get isOrderConfirmed(): boolean {
    return this.order.info.every((it) => it.status !== 'none' || it.isCanceled)
  }

  get isDefault(): boolean {
    return this.orderInfo && !this.orderInfo.every((it) => it.status !== 'none' || it.isCanceled)
  }

  get hasDeliveredProduct(): boolean {
    return this.orderInfo && this.orderInfo.filter((it) => it.isDelivered).length > 0
  }

  orderInfo: DisplayedOrderInfoDocument[]
  isPaying = false

  private mapOrder: OrderMapper

  constructor(
    private orderRepository: OrderDocRepository,
    private dialog: MatDialog,
    private cloudFunctionsService: CloudFunctionsService,
    private overlaySpinnerService: OverlaySpinnerServiceService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.order && changes.order.currentValue) {
      const order = changes.order.currentValue as DisplayedOrderDocument
      this.orderInfo = [...order.info].map((it) => ({ ...it }))
    }
  }

  ngOnInit() {
    this.mapOrder = new OrderMapper()
  }

  onOrderStatusChanged({ action, productId }: { action: 'cancel' | 'receiveAnOrder', productId: string }) {
    action === 'cancel' ? this.cancel(productId) : this.receiveAnOrder(productId)
  }

  private cancel(productId: string) {
    const index = this.orderInfo.findIndex((it) => it.productId === productId)
    this.orderInfo[index].isCanceled = true
    this.orderInfo[index].status = 'none'
  }

  private receiveAnOrder(productId: string) {
    const index = this.orderInfo.findIndex((it) => it.productId === productId)
    this.orderInfo[index].isCanceled = false
    this.orderInfo[index].status = 'accepted'
  }

  executeIfComfirmed() {
    const dialog = this.orderConfirmDialog

    dialog.afterClosed()
      .pipe(first())
      .subscribe((it) => this.executeIfOk(it))
  }

  // 
  // 決算処理 ------------------------------------
  //
  private executeIfOk(modalResult?: string) {
    if (modalResult !== 'はい') {
      return
    }

    /**
     * 以下の条件があるため、確実に指定したデータが変更できるようにOrderデータをdeepCopyしている
     *   - 注文情報(DisplayedOrderDocument)は参照渡しのデータ
     *   - OrderListItemComponentは`cdk-virtual-scroll-viewport`で使われている。
     *     そのため、新しいデータが入ってきた場合、Componentが再利用されてしまい
     *     データが置き換わってしまう可能性がある、つまり`this.order`とすると
     *     別のデータが指定されてしまう可能性がある。
     */
    const order = { ...this.order }
    order.info = this.orderInfo.map((it) => ({ ...it }))

    of(order)
      .pipe(
        first(),
        tap((_) => this.startExecutePayment()),
        switchMap((it) => this.executeUpdateOrder(this.mapOrder.onOrderConfirmed, it)),
        filter((it) => it.info.some((info) => info.status === 'accepted')),
        switchMap((it) => this.executePayment(it)),
        filter((it) => typeof it !== 'undefined'),
        switchMap((it) => this.executeUpdateOrder(this.mapOrder.onPaymentCompleted, it)),
        filter((it) => typeof it !== 'undefined'),
      )
      .subscribe({ complete: () => {
        this.show(this.paymentSucceededDialog)
        this.endExecutePayment()
      } })
  }

  private startExecutePayment() {
    this.isPaying = true
    this.overlaySpinnerService.show()
  }

  private endExecutePayment() {
    this.isPaying = false
    this.overlaySpinnerService.hide()
  }

  private executePayment(order: DisplayedOrderDocument): Observable<DisplayedOrderDocument | undefined> {
    return this.cloudFunctionsService
      .payAnOrder({ id: order.id } as OrderDocument)
      .pipe(
        first(),
        map((_) => order),
        catchError((error) => {
          console.log(error)
          this.show(this.getPaymentFailuredDialog(order))
          return undefined
        })
      ) as Observable<DisplayedOrderDocument | undefined>
  }

  private updateOrderAsObservable(order: OrderDocument): Observable<void> {
    return from(this.orderRepository.update(order))
  }

  private executeUpdateOrder(mapper: (order: DisplayedOrderDocument) => OrderDocument, displayedOrder: DisplayedOrderDocument): Observable<DisplayedOrderDocument | undefined> {
    const order = mapper(displayedOrder)
    return this.updateOrderAsObservable(order)
      .pipe(
        first(),
        map((_) => displayedOrder),
        catchError((error) => {
          console.log(error)
          this.show(this.getOrderUpdateFailuredDialog(displayedOrder))
          return undefined
        })
      ) as Observable<DisplayedOrderDocument | undefined>
  }

  private show(dialog: MatDialogRef<OverlayDialogComponent, any>) {
    this.endExecutePayment()
    dialog
  }

  // 
  // dialogs ------------------------------------
  //
  private get orderConfirmDialog() {
    return this.dialog.open(OverlayDialogComponent, {
      height: '350px',
      width: '300px',
      disableClose: false,
      data: {
        title: '確認事項',
        message: `
          <div>
            「キャンセル（決済なし）」を選択した商品は決済されず、
            お客様にキャンセルのメールが送信されます。
          </div>
          <div>
            「受注（決済実行）」を選択した商品は決済が実行され、
            お客様に注文完了メールが送信されます。
            商品をお客様に早急にお届けしてください。
          </div>
        `,
        button1Name: 'はい',
        button2Name: 'キャンセル'
      } as DialogData
    })
  }

  private get paymentSucceededDialog() {
    let message =  `
      <div>
        選択された処理が完了しました。
      </div>
    `
    return this.dialog.open(OverlayDialogComponent, {
      height: '180px',
      width: '200px',
      disableClose: true,
      data: {
        title: '処理完了',
        message,
        button1Name: '確認'
      } as DialogData
    })
  }

  private getPaymentFailuredDialog(order: DisplayedOrderDocument) {
    return this.dialog.open(OverlayDialogComponent, {
      height: '320px',
      width: '320px',
      disableClose: true,
      data: {
        title: '決済エラー',
        message: `
          <div>
            決済処理でエラーが発生しました。
          </div>
          <br />
          <div>
            <div>対象注文番号: ${order.id}</div>
            <div>購入者ID: ${order.userId}</div>
          </div>
          <br />
          <div>
            システム管理者へ連絡してください。
          </div>
        `,
        button1Name: 'はい'
      } as DialogData
    })
  }

  private getOrderUpdateFailuredDialog(order: DisplayedOrderDocument) {
    return this.dialog.open(OverlayDialogComponent, {
      height: '280px',
      width: '280px',
      disableClose: true,
      data: {
        title: '注文更新エラー',
        message: `
          <div>
            注文更新処理でエラーが発生しました。
          </div>
          <div>
            <div>対象注文番号 ${order.id}</div>
            <div>購入者ID ${order.userId}</div>
          </div>
          <div>
            システム管理者へ連絡してください。
          </div>
        `,
        button1Name: 'はい'
      } as DialogData
    })
  }
}


