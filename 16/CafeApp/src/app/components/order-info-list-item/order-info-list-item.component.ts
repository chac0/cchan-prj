import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DisplayedOrderInfoDocument } from 'src/app/models';

@Component({
  selector: 'app-order-info-list-item',
  templateUrl: './order-info-list-item.component.html',
  styleUrls: ['./order-info-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInfoListItemComponent implements OnInit {
  @Input() orderInfo!: DisplayedOrderInfoDocument
  @Input() isOrderConfirmed!: boolean
  @Output() changeOrderStatus = new EventEmitter<{ action: 'cancel' | 'receiveAnOrder', productId: string }>()

  get toggleStatus(): string {
    if (this.orderInfo.isCanceled) {
      return 'cancel'
    }
    if (this.orderInfo.status !== 'none') {
      return 'receiveAnOrder'
    }
  }

  constructor() { }

  ngOnInit() { }

  cancelHandler() {
    if (this.isOrderConfirmed) {
      return
    }
    this.changeOrderStatus.emit({
      action: 'cancel',
      productId: this.orderInfo.productId
    })
  }

  receiveAnOrderHandler() {
    if (this.isOrderConfirmed) {
      return
    }
    this.changeOrderStatus.emit({
      action: 'receiveAnOrder',
      productId: this.orderInfo.productId
    })
  }
}
