import { Component, OnInit } from '@angular/core';
import { ShopDocRepository } from '../../repositories';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ShopDocument } from '../../models';
import { Iso8601 } from '../../utils/iso8601';
import { ThrowStmt } from '@angular/compiler';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayDialogComponent, DialogData } from '../../components/overlay-dialog/overlay-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ShopService } from '../../services/shop.service';

// // 定数
// const SELECT_YEAR_START:number = 2020;
const SELECT_YEAR_RANGE:number = 200;

const phoneValidPattern:string = '^(0{1}\d{9,10})$';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  // フォーム
  form: FormGroup;

  // 店舗情報モデル
  shop: ShopDocument;

  // 画面表示
  endYear: number;
  endMonth: number;
  endDay: number;
  openYear: number;
  openMonth: number;
  openDay: number;

  endHour: number;
  endMin: number;
  openHour: number;
  openMin: number;

  loginMail: string;
  name: string = '';
  phone: string;
  passWord: string;
  brandName: string;

  mail1: string = '';
  mail2: string = '';
  mail3: string = '';
  mail4: string = '';

  // ドロップダウンリスト
  yearList: number[];
  monthList: number[];
  opendayList: number[];
  enddayList: number[];
  hourList: number[];
  minList: number[];

  // 登録ボタン制御
  formAvailable: boolean;

  // SELECT_YEAR_START:number;


  constructor( private shopDocRepository: ShopDocRepository,
	       private angularFireAuth: AngularFireAuth,
               private formBuilder: FormBuilder,
	       private overlay: Overlay,
	       private dialog: MatDialog,
	       private router: Router,
	       private shopService: ShopService) {


    var now = moment();
    console.log(now.toDate()); // Dateオブジェクトが返される
    this.openYear = now.year();
      
    // form作成
    this.form = this.formBuilder.group({
      loginMail: ['', [Validators.required,Validators.email]],
      passWord: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(128)]],
      name: ['', [Validators.required,Validators.maxLength(100)]],
      brandName: ['', [Validators.required,Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      mail1: ['',[Validators.email]],
      mail2: ['',[Validators.email]],
      mail3: ['',[Validators.email]],
      mail4: ['',[Validators.email]],
      openYear:  [0, [Validators.min(this.openYear)]],
      openMonth: [0, [Validators.min(1),Validators.max(12)]],
      openDay:   [0, [Validators.min(1),Validators.max(this.getDayLength(this.openYear,this.openMonth))]],
      endYear:   [0, [Validators.min(this.openYear)]],
      endMonth:  [0, [Validators.min(1),Validators.max(12)]],
      endDay:    [0, [Validators.min(1),Validators.max(this.getDayLength(this.endYear,this.endMonth))]],
      openHour:  [-1, [Validators.min(0),Validators.max(23)]],
      openMin:   [-1, [Validators.min(0),Validators.max(59)]],
      endHour:   [-1, [Validators.min(0),Validators.max(23)]],
      endMin:    [-1, [Validators.min(0),Validators.max(59)]]
    });

    // 登録ボタン有効化
    this.formAvailable = true;
    // ドロップダウンリスト初期化
    this.initOptionLists();
  }
  ngOnInit(){
  }
  
  //========================
  // フォーム投稿
  //========================
  onSubmit( e: Event ) {
    console.log(this.form);
    this.registerOperation();
  }

  //========================
  // 登録メイン処理
  //========================
  registerOperation( ):void {
    // 初期処理
    this.startOperation();
    //フォームチェック
    if (!this.validationAll( )) {
      this.openErrorDialog();
      this.finishOperation();      
      return;
    }
    // データ整形
    const newData = this.formatData();
    // 認証データ登録
    try {
      this.registerUser(this.loginMail,this.passWord);
    } catch (error) {
      // I don't care
    } finally {
    }
    
    // 店舗データ登録処理
    try {
      this.registerNewShop(newData);
      // 成功
      this.shopService.onNotifySharedDataChanged( newData );
      this.openFinishDialog();
      this.router.navigate(['/product_list']);
    } catch (error ) {
      // 失敗
      this.openErrorDialog();
    } finally {
      this.finishOperation();
    }
  }

  //========================
  // 登録初期処理
  //========================
  // スピナー
  spinner = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });
  startOperation( ):void{
    // プログレス表示
    this.spinner.attach(new ComponentPortal(MatSpinner));
    // 登録ボタン非活性
    this.formAvailable = false;
  }

  //========================
  // 登録後処理
  //========================
  finishOperation( ):void{
    // プログレス消去
    this.spinner.detach();
    // 登録ボタン活性
    this.formAvailable = true;
  }

  //========================
  // データ形成
  //========================
  formatData( ):ShopDocument {
    let newData:ShopDocument  = new ShopDocument();
    newData.createdAt = Iso8601.now();
    newData.closedDate = moment(new Date(this.endYear,this.endMonth,this.endDay)).format('YYYY/MM/DD');
    newData.closedTime = String(this.endHour).padStart(2,'0') + ':' + String(this.endMin).padStart(2,'0');
    newData.openDate = moment(new Date(this.openYear,this.openMonth,this.openDay)).format('YYYY/MM/DD');
    newData.openTime = String(this.openHour).padStart(2,'0') + ':' + String(this.openMin).padStart(2,'0');
    newData.isOpened = false;
    newData.loginMail = this.loginMail;
    newData.mails.push(this.mail1)
    newData.mails.push(this.mail2)
    newData.mails.push(this.mail3)
    newData.mails.push(this.mail4)
    newData.name = this.name;
    newData.brandName = this.brandName;
    newData.phone = this.phone;
    return newData;
  }
  
  //========================
  // フォーム投稿
  //========================
  validationAll( ): boolean {
    if( !this.form.valid ){
      return false;
    }
    return true;
  }
  
  //========================
  // フォーム投稿
  //========================
  async registerNewShop(shop:ShopDocument) {
    try {
      await this.shopDocRepository.create( shop );
    } catch ( error ) {
      throw( error );
    } finally {
    }
  }

  //========================
  // ユーザ登録
  //========================
  async registerUser(mail:string,passwd:string){
    try {
      // ユーザーの登録
      const credential = await this.angularFireAuth.auth.createUserWithEmailAndPassword(mail, passwd)
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  //========================
  // エラーダイヤログ表示
  //========================
  openErrorDialog( ):void {

    var dlgData:DialogData
    dlgData = {title: '登録に失敗しました。', message: 'もう一度登録を実行しますか？ 再度実行して失敗したときは <a href="mailto:00cafe@tokyu-land.co.jp">000cafe@tokyu-land.co.jp</a> にご連絡ください。' ,
	       button1Name: 'キャンセル', button2Name:'登録'}	  
    const dialogRef = this.dialog.open(OverlayDialogComponent, {
      disableClose: true,
      data: dlgData	     
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // ダイヤログで登録が選ばれたらもう一度。
      if(result===dlgData.button2Name)
      { // 再起
	this.registerOperation(  );
      }
    });
  }

  //========================
  // 完了ダイヤログ表示
  //========================
  openFinishDialog( ): void {
    const dialogRef = this.dialog.open(OverlayDialogComponent, {
      disableClose: false,
      data: {title: '登録しました。', message: '' ,
	     button1Name: '', button2Name:'OK'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  //========================
  // ドロップダウンリスト初期化
  //========================
  initOptionLists():void {
    this.yearList = [];
    this.monthList = [];
    this.hourList = [];
    this.minList = [];
    this.opendayList = [];
    this.enddayList = [];
    for(let i=0;i<SELECT_YEAR_RANGE;i++)
    {
      this.yearList.push(i+this.openYear);
      if(i<12){
	this.monthList.push(i+1);
      }
      if(i<24){
	this.hourList.push(i+1);
      }
      if(i<60){
	this.minList.push(i);
      }
    }
  }

  //========================
  // 月ごとの日ドロップダウン生成
  //========================
  getDayLength(yr,mt) {
    return new Date(yr, mt, 0).getDate();
  }
  createDayList(yr,mt):number[] {
    let dayLength = this.getDayLength(yr, mt)
    let dayList:number[] = [];
    for(let i = 0; i < dayLength; i++) {
      dayList.push(1 + i);
    }
    
    return dayList;
  }
  
  // TODO: 数値のみ入力可能にするかPO確認
  // numberOnly(event): boolean {
  //   console.log('numberOnly');
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;

  // }



}


