import { ShopDocument } from '../../models';
import { ShopDocRepository } from 'src/app/repositories/shop-repository';
import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-open-close',
  templateUrl: './open-close.component.html',
  styleUrls: ['./open-close.component.scss']
})
export class OpenCloseComponent implements OnInit {

  constructor(
    private shopDocRepository: ShopDocRepository,
    private authService:AuthService,
    private localStorageService:LocalStorageService,
  ) { }

  // DBのステータス
  currentState: string;
  // 店舗情報モデル
  shop: ShopDocument;
  // 画面上でのOPEN・CLOSE状態(0:CLOSE 1:OPEN)
  selectedState: number;
  // 画面上でのOPEN・CLOSE状態　日本語表記
  openStatus: any = [{ label: 'CLOSE', value: 0 }, { label: 'OPEN', value: 1 }];
  // 更新ボタンを押せるかどうか
  canSubmit: boolean;

  ngOnInit() {
    const shopID = this.localStorageService.getShopDocument().id;
    this.shopDocRepository.findById(shopID).subscribe(shop => {
      this.initialize(shop);
    });
  }

  // 初期化処理
  initialize(shop) {
    this.shop = shop;
    this.currentState = shop.isOpened ? 'OPEN' : 'CLOSE';
    this.selectedState = shop.isOpened ? 1 : 0;
    this.canSubmit = false;

  }

  // ラジオボタンが変更されたときの処理
  onChangeState() {
    const selectedStateIsOpen = this.selectedState === 1;
    if (selectedStateIsOpen === this.shop.isOpened) {
      this.canSubmit = false;
    } else {
      this.canSubmit = true;
    }
  }

  // 更新処理
  submit() {
    if (this.canSubmit === false) {
      return;
    }
    const selectedStateIsOpen = this.selectedState === 1;
    this.shop.isOpened = selectedStateIsOpen;
    this.shopDocRepository.update(this.shop.id, this.shop);
    this.initialize(this.shop);
  }

}
