import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';


import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
// import {map} from 'rxjs/operators';
import {ShopDocument} from '../models';
import {LocalStorageService} from './local-storage.service';
import { ShopDocRepository } from '../repositories/shop-repository';
import { resolve } from 'url';
import { promise } from 'protractor';
import {FirebaseError} from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Observable<firebase.User>;
  error: string;

  constructor(private angularFireAuth: AngularFireAuth,
              private router: Router,
              private localStorage: LocalStorageService,
              private shopRepository: ShopDocRepository,
              )
  {
    this.userData = angularFireAuth.authState;
  }

  //--------------------------
  // FirebaseAuth登録を実行
  //--------------------------
  SignUp(email: string, password: string) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        alert(email+'で登録完了しました:');
        this.router.navigate(['/product_list'] );
      })
      .catch(error => {
        alert('以下の理由で登録できませんでした:'+error.message);
      });
  }

  //--------------------------
  // FirebaseAuthサインインを実行
  //--------------------------
  SignIn(email: string, password: string) {
    this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        //localstrageに保存
        this.localStorage.setLoginInfo(email, password);
        this.shopRepository.findByLoginMail(email)
        .subscribe(shops=>{
          for (let t of shops) {
            this.localStorage.setShopDocument( t as ShopDocument );
          }
          //商品一覧に遷移
          this.router.navigate(['/product_list'] )
        });

      })
      .catch(err => {
        this.error = err.message;
      });
  }
  Login( email:string, password: string ): Promise<void>{
    return this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        //localstrageに保存
        this.localStorage.setLoginInfo(email, password);
        this.shopRepository.findByLoginMail(email)
        .subscribe(shops=>{
          for (let t of shops) {
            this.localStorage.setShopDocument( t as ShopDocument );
          }
          return Promise.resolve();
        });
      })
      .catch(err=>{
        this.error = err.message;
        return Promise.reject();
      });

  }

  //--------------------------
  // FirebaseAuthサインアウトを実行
  //--------------------------
  SignOut() {
    this.angularFireAuth
      .auth
      .signOut()
      .then(() => {
        this.error = '';
      })
      .catch(error => {
      });
      this.router.navigate(['/']);
  }

}
