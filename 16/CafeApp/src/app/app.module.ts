import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
//------------------------
// Routing
// ------------------------
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// ------------------------
// FireBase
// ------------------------
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireFunctions,
        AngularFireFunctionsModule,
        //TODO: cloud funciton local向き先へ変更。deploy時消す
        FUNCTIONS_ORIGIN }
        from '@angular/fire/functions';

//------------------------
// Angular Materials
//------------------------
import { MatSpinner } from '@angular/material';
import { MaterialsModule } from './materials/materials.module';

//------------------------
// Custom Pipes
// ------------------------
import { EitherPipe } from './pipes/either.pipe';

//------------------------
// Custom Directives
// ------------------------
import { ImageLoaderDirective } from './directives/image-loader.directive';

//------------------------
// Custom Components(View)
// ------------------------
import { SampleComponent } from './views/sample/sample.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { OpenCloseComponent } from './views/open-close/open-close.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { SampleApiCallComponent } from './views/sample-api-call/sample-api-call.component';
import { OrderListComponent } from './views/order-list/order-list.component';
import { ProductEditComponent } from './views/product-edit/product-edit.component';
import { ProductImgListComponent } from './views/product-img-list/product-img-list.component';

//------------------------
// Custom Components(Common)
// ------------------------
import { OverlayDialogComponent } from './components/overlay-dialog/overlay-dialog.component';
import { NotifyErrorBoxComponent } from './components/notify-error-box/notify-error-box.component';
import { OverlaySpinnerComponent } from './components/overlay-spinner/overlay-spinner.component';
import { ProductCsvExportComponent } from './views/product-csv-export/product-csv-export.component';
import { ProductListTemplateComponent } from './components/product-list-template/product-list-template.component';
import { OrderListItemComponent } from './components/order-list-item/order-list-item.component';
import { OrderInfoListItemComponent } from './components/order-info-list-item/order-info-list-item.component';
import { CsvConfirmDialogComponent } from './components/csv-confirm-dialog/csv-confirm-dialog.component';
import { LogoutConfirmDialogComponent } from './components/logout-confirm-dialog/logout-confirm-dialog.component';
import { ProductImgListTemplateComponent } from './components/product-img-list-template/product-img-list-template.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductListUpdateComponent } from './components/product-list-update/product-list-update.component';


@NgModule({
  declarations: [
    // Pipes
    EitherPipe,
    // Directives
    ImageLoaderDirective,
    // Custom Componets
    AppComponent,
    SampleComponent,
    LoginComponent,
    RegisterComponent,
    OpenCloseComponent,
    SubHeaderComponent,
    OverlayDialogComponent,
    SampleApiCallComponent,
    OrderListComponent,
    NotifyErrorBoxComponent,
    OverlaySpinnerComponent,
    ProductImgListComponent,
    ProductEditComponent,
    ProductCsvExportComponent,
    ProductListTemplateComponent,
    ProductImgListTemplateComponent,
    OrderListItemComponent,
    OrderInfoListItemComponent,
    CsvConfirmDialogComponent,
    LogoutConfirmDialogComponent,
    ProductListComponent,
    ProductListUpdateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ScrollingModule,
    // FireBase
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    // Angular Material
    MaterialsModule
    //Custom Components
  ],
  entryComponents: [
    OverlayDialogComponent,
    MatSpinner,
    OverlaySpinnerComponent,
    CsvConfirmDialogComponent,
    LogoutConfirmDialogComponent
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireFunctions,
    //TODO: cloud funciton local向き先へ変更。deploy時消す
    //{provide:FUNCTIONS_ORIGIN, useValue:'http://localhost:5001'}
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
