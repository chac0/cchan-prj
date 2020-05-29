import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ShopDocument } from '../models';



export enum LocalStorageKeys{
  loginMail = 'LOGIN_MAIL',
  loginPass = 'LOGIN_PASS',
  shopDocument = 'SHOP_DOCUMENT',
}

@Injectable({
  providedIn: 'root'
})
/*----------------------------------

 LocalStorageへデータのIN/OUT

----------------------------------*/
export class LocalStorageService {
  

  test:string;

  constructor( ) { this.test = 'ほげほげ';}


  get shopDocument(): ShopDocument{
    return this.getShopDocument();
  }
  set shopDocument(shop:ShopDocument){}

  setLoginInfo( loginMail:string, loginPass:string ){
    this.setLoginMail(loginMail);
    this.setLoginPass(loginPass);
  }


  //--------------------
  // LoginMail
  //--------------------
  //localStorageにloginMailのセット
  private setLoginMail( loginMail: string ){
    localStorage.setItem(LocalStorageKeys.loginMail, loginMail);

  }
  //localStorageからloginMailの取得
  getLoginMail(){
    return localStorage.getItem(LocalStorageKeys.loginMail);
  }
  //localStorageからloginMailの削除
  private removeLoginMail() {
    localStorage.removeItem( LocalStorageKeys.loginMail );
  }
  //--------------------
  // loginPass
  //--------------------
  //localStorageにloginMailのセット
  private setLoginPass( loginPass: string ){
    localStorage.setItem(LocalStorageKeys.loginPass, loginPass);

  }
  //localStorageからloginMailの取得
  private getLoginPass(){
    return localStorage.getItem(LocalStorageKeys.loginPass);
  }
  //localStorageからloginMailの削除
  private removeLoginPass() {
    localStorage.removeItem( LocalStorageKeys.loginPass );
  }
  //--------------------
  // ShopDocument
  //--------------------
  //localStorageにshopDocumentのセット
  setShopDocument(shop: ShopDocument) {
    this.shopDocument = shop;
    localStorage.setItem(LocalStorageKeys.shopDocument, JSON.stringify(shop));
  }

  //localStorageからshopDocumentの取得
  getShopDocument(): ShopDocument{
    return JSON.parse( localStorage.getItem( LocalStorageKeys.shopDocument ) );
  }

  //localStorageからshopDocumentの削除
  private removeShopDocument() {
    localStorage.removeItem( LocalStorageKeys.shopDocument );
  }

}
