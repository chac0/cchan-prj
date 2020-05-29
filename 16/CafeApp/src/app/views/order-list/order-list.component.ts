import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {DisplayedOrderDocument, ProductInfoDocument, ShopDocument, StorageProductImgPathWithFolder} from 'src/app/models';
import { OrderService } from 'src/app/services/order.service';
import {map, filter, switchMap, tap} from 'rxjs/operators';
import { Iso8601 } from 'src/app/utils/iso8601';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {ProductInfoDocRepository, ShopDocRepository} from '../../repositories';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {OverlaySpinnerServiceService} from '../../services/ui/overlay-spinner/overlay-spinner-service.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orderList$: Observable<DisplayedOrderDocument[]>
  unconfirmedOrderList$: Observable<DisplayedOrderDocument[]>

  serverDataList: ProductInfoDocument[];
  loading: boolean = false;
  shopDocument: ShopDocument;

  constructor(
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private productRepository: ProductInfoDocRepository
    ,private storage: AngularFireStorage
    ,private authService:AuthService
    ,private shopDocRepository: ShopDocRepository

  ) { }

  ngOnInit() {
    const shopId = this.localStorageService.shopDocument.id
    const orderList = this.orderService
      .findAllShopOrdersByShopId(shopId)
      .pipe(
        filter((orders) => orders.filter((it) => it.info.length > 0).length > 0),
        map((it) => it.sort((a, b) => Iso8601.fromString(a.createdAt) > Iso8601.fromString(b.createdAt) ? -1 : 1))
      )

    this.orderList$ = orderList
    this.unconfirmedOrderList$ = orderList.pipe(
      map((orders) => orders.filter((it) => it.info.some((info) => info.status === 'none' && !info.isCanceled))),
    )

    this.loading = true;
    this.authService.userData.pipe(
      //-----------------------------------
      //ログインしているShopDocumentの取得
      //-----------------------------------
      switchMap((user) => this.shopDocRepository.findByLoginMail(user.email)),
      tap((shops) => shops.forEach((shop) => (this.shopDocument = shop)
      )),
      //-----------------------------------
      //  商品一覧を取得
      //-----------------------------------
      switchMap((_) => this.productRepository.getList(this.shopDocument.id))
    ).subscribe(async (it) => {
      //-----------------------------------------
      // Storageから商品画像のdownloadurlを取得
      //-----------------------------------------
      const products =
        await Promise.all(
          it
            .map((it) => [it, StorageProductImgPathWithFolder(this.shopDocument.id) + it.imagePath] as [ProductInfoDocument, string])
            .map(([product, storagePath]) =>
              [product, this.storage.storage.ref(storagePath)] as [ProductInfoDocument, firebase.storage.Reference])
            .map(async ([product, ref]) => {
              if( product.imagePath == undefined || product.imagePath == '' ){
                return product;
              }
              try
              {
                const url = await ref.getDownloadURL();
                product.imageUrl = url;
              }catch(e){
              }finally{
                return product;
              }
            })
        )

      this.serverDataList = products;
      this.loading = false;
    })
  }
}
