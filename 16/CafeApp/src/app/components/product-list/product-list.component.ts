import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import {DisplayedOrderDocument, OrderDocument, OrderInfoDocument, ProductInfoDocument} from 'src/app/models';
import * as moment from 'moment';
import {Iso8601} from '../../utils/iso8601';
import {OrderDocRepository, ProductInfoDocRepository} from '../../repositories';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first, switchMap, takeWhile, tap, timestamp} from 'rxjs/operators';
import {DialogData, OverlayDialogComponent} from '../overlay-dialog/overlay-dialog.component';
import {MatDialog} from '@angular/material';
import {of} from 'rxjs';
import {ShippingAddress} from '../../models/shipping-address';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit, OnChanges {

  @Input() productList: ProductInfoDocument[];
  @Input() loading: boolean;
  @Input() tableCsvClassName: string;
  @Input() isOrderConfirmed: boolean;
  orderForm: FormGroup;
  isCanceled: boolean;
  status: string;
  type: string;
  id: string;
  isOk: boolean;
  isReadOnly: boolean = false;
  quantity: string;
  orderInfoDocuments: OrderInfoDocument[];
  newData: OrderDocument[];
  shopID: string;

  constructor( private orderRepository: OrderDocRepository,
               private productInfoDocRepository: ProductInfoDocRepository,
              private formBuilder: FormBuilder,
               private firestore: AngularFirestore,
               private dialog: MatDialog,
               private localStorageService:LocalStorageService ) {
    this.setUpForm();
  }

  ngOnInit() {
    this.shopID = this.localStorageService.getShopDocument().id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setUpForm();
  }

  setUpForm() {
    this.orderForm = this.formBuilder.group({
      order_number: [0, [Validators.required]],
    });
 }

  update(number_stock: number, id: string, i: string) {
    //新規追加処理
    this.productInfoDocRepository.findById(id).subscribe(data => {
      data.stock = number_stock;
      this.firestore.collection( "products" ).doc( id ).set( Object.assign({}, data) );
    });
    const element2: HTMLInputElement =<HTMLInputElement>document.getElementById('order_number-'+i);
    element2.value = "0";
    this.isReadOnly = true;
   // this.isOrderConfirmed = true;
  }

    orderHandler(id: string, i: string) {
      this.id = id;
      const element2: HTMLInputElement =<HTMLInputElement>document.getElementById('order_number-'+i);
      this.quantity = element2.value;

    this.executeOrder();
      console.log('tt',this.isOk);
    if (this.isOk == false) {
      return
    }

      this.order(Number(this.quantity),id);

  }

  executeOrder() {
    const dialog = this.orderConfirmDialog

    dialog.afterClosed()
      .pipe(first())
      .subscribe((it) => this.executeIfOk(it))
  }

  //
  // 決算処理 ------------------------------------
  //
    private executeIfOk(modalResult?: string) {
      if (modalResult !== 'Yes') {
        this.isOk = false;
      } else {
        this.isOk = true;
      }
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
        title: 'Order Confirmation',
        message: `
          <div>
            Will you proceed the order with quantity of ${this.quantity} count(s)?
          </div>
        `,
        button1Name: 'Yes',
        button2Name: 'No'
      } as DialogData
    })
  }

  order(number_stock: number, id: string) {

    this.orderRepository.findAllByShopId(this.shopID).subscribe(data => {
           this.newData = data;
            const orderInfoDocuments: OrderInfoDocument[] = [
            {
              productId: this.id,
              price: 0,
              amount: Number(number_stock),
               subTotal: 0,
               status: 'none',
               isCanceled: false,
               isDelivered: false
             }
               ];
            this.newData[0].info[0].productId = this.id;
             this.newData[0].info[0].amount = Number(number_stock);

            //新規追加処理
      const newId = this.firestore.createId();
      this.newData[0].id = newId;
      this.newData[0].orderId = newId + '-' + timestamp();

      this.firestore.collection( "orders" ).doc(newId).set( Object.assign({}, this.newData) )
        .then(function( ){
          console.log('作成成功');
        })
        .catch(function( error ){
          console.error(error);
        });
          });
        }

}
