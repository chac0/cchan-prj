import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
//------------------------
// Custom Components(View)
//------------------------
import { AppComponent } from './app.component';
import { SampleComponent } from './views/sample/sample.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { OpenCloseComponent } from './views/open-close/open-close.component';
import { OrderListComponent } from './views/order-list/order-list.component';
import { SampleApiCallComponent } from './views/sample-api-call/sample-api-call.component';
import { ProductImgListComponent } from './views/product-img-list/product-img-list.component';
import { ProductEditComponent } from './views/product-edit/product-edit.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  //サンプル画面（TODO:後で消す）
  { path: 'sample', component: SampleComponent, canActivate: [AuthGuard] },
  //店舗登録
  { path: 'register', component: RegisterComponent },
  //ログイン
  { path: 'login', component: LoginComponent },
  //店舗商品一覧/商品編集
  { path: 'product_list', component: ProductEditComponent, canActivate: [AuthGuard] },
  //開店・閉店
  { path: 'open_close', component: OpenCloseComponent, canActivate: [AuthGuard] },
  //注文一覧
  { path: 'order_list', component: OrderListComponent, canActivate: [AuthGuard] },
  //floud function oncall api呼び出しサンプル（TODO:後で消す）
  { path: 'sample_api_call', component: SampleApiCallComponent, canActivate: [AuthGuard] },
  //商品画像一覧
  { path: 'product_img_list', component: ProductImgListComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
