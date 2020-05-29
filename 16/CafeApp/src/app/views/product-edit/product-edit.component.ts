import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap, tap } from 'rxjs/operators';

import {ProductInfoDocument, SampleDocument, ShopDocument} from '../../models';
import { CSVLoader } from '../../mappers/product-csv';
import { ProductInfoDocRepository } from '../../repositories';
import { ShopDocRepository } from '../../repositories';
import { FileIO } from '../../utils/FileIO';
import { AuthService } from '../../services/auth.service';
import { StorageProductImgPathWithFolder } from '../../models/storage-image-info';
import { CsvConfirmDialogComponent } from '../../components/csv-confirm-dialog/csv-confirm-dialog.component';
import { OverlaySpinnerServiceService } from '../../services/ui/overlay-spinner/overlay-spinner-service.service';

import { Tools } from '../../utils/Tools';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Iso8601} from '../../utils/iso8601';
import {AngularFirestore} from '@angular/fire/firestore';
import {LocalStorageService} from '../../services/local-storage.service';


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  shopDocument: ShopDocument;

  readText: string;
  serverDataList: ProductInfoDocument[];
  csvDataList: ProductInfoDocument[];

  selectedFileName: string = '';
  errorMsg: string = '';
  loading: boolean = false;
  csvLoded: boolean = false;

  //アップロードを許可するファイルの拡張子
  allow_exts: string[] = new Array('csv', 'CSV');

  form: FormGroup;

  dataList: SampleDocument[];
  // DataStore用のカラム
  displayedColumns: string[] = ['name', 'price', 'stock'];

  //form bind用の変数
  name: string;
  price: string;
  stock: number;
  shopId: string;

  constructor(
    private productRepository: ProductInfoDocRepository
    ,private storage: AngularFireStorage
    ,private matDialog: MatDialog
    ,private overLaySpinner: OverlaySpinnerServiceService
    ,private authService:AuthService
    ,private shopDocRepository: ShopDocRepository,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private firestore: AngularFirestore
  ) {
    this.setUpForm();
  }

  setUpForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: [0, Validators.required]
    });
  }

  ngOnInit() {

    this.loading = true;

    this.shopId = this.localStorageService.shopDocument.id

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

  //============================
  // ファイル選択ボタンイベント:click
  // clickされた時にvalueをclearしないと
  // 同名ファイルが選択された時に起動しない
  //============================
  onClearSelectFile( event:any ){
    event.target.value = '';
  }

  //============================
  // ファイル選択イベント:onChange
  //============================
  async onFileSelected( e:any ) {

    //テキストボックスの表示（意味はない）
    //C\fakepath/file名になってかっこ悪いのでファイル名のみにする
    this.selectedFileName = FileIO.getFileName( e.target.value );

    this.errorMsg = '';
    const file = e.target.files[0];

    if(file == undefined || file == null){
      return;
    }
    //ファイル拡張子のチェック（必ずnull objectが配列に混じるので）
    if( file.type == undefined || !FileIO.checkExt(file.name, this.allow_exts) ){
      this.errorMsg = 'ファイルがcsvではありません';
      return;
    }

    //--------------------
    //ファイルロード
    //--------------------
    await this.fileToText(file)
      .then(text => {
        this.readText = text;
        try{
          this.loadCSVTable();
          this.openCSVConfirmDialog();
        }
        catch(e){
          this.errorMsg = 'ファイルの内容が正しいCSVか確認してください';
        }
      })
      .catch(err => this.errorMsg = err);

  }
  //============================
  // 任意のファイルをロードする
  //============================
  fileToText(file): Promise<string> {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result.toString());
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  //============================
  // CSVをパース
  //============================
  loadCSVTable(){
    try{
      let csvLoader:CSVLoader = new CSVLoader(this.readText);
      this.csvDataList = csvLoader.csvTable;
      this.csvLoded = true;
      //this.ShowList(1);
    }catch(e){
      throw new Error(e);
    }
  }

  //===========================
  // CSVインポートの確認ダイアログを開く
  //===========================
  async openCSVConfirmDialog()
  {

    this.overLaySpinner.show();

    for(let key in this.csvDataList){
      let product = this.csvDataList[key];
      try{
        //-----------------------------------------
        // Storageから商品画像のdownloadurlを取得
        //-----------------------------------------
        const storagePath = StorageProductImgPathWithFolder(product.shopId) + product.imagePath;
        const ref = this.storage.storage.ref(storagePath);
        const url = await ref.getDownloadURL();
        product.imageUrl = url;
      }catch(e){ }

    }

    //-----------------------------------------
    // 確認ダイアログを開く
    //-----------------------------------------
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "100vh";
    dialogConfig.width = "100vw";
    dialogConfig.data =  this.csvDataList;//データを渡す
    const modalDialog = this.matDialog.open(CsvConfirmDialogComponent, dialogConfig);

    //アップロードボタンが押されたイベントキャッチ
    modalDialog.componentInstance.submitUpload.subscribe(()=>{
      this.upload();
    });
    this.overLaySpinner.hide();

  }

  //===========================
  // CSVの中身を
  // firestoreに書き込みにいく
  //===========================
  async upload()
  {
    this.overLaySpinner.show();
    try{
      await this.productRepository.setProducts(this.shopDocument.id, this.csvDataList);
    }
    catch(e)
    {
      this.errorMsg = '[Error]:'+ e;
    }
    finally{
      this.overLaySpinner.hide();
    }
  }

  //========================
  // フォーム投稿
  //========================
  onSubmit( e: Event ) {

    //フォームチェック
    if (!this.form.valid) {
      return;
    }

    //-----------------------------
    // firestoreへ新規データ入れる
    //-----------------------------
    // 新規データ形成
    const newData:ProductInfoDocument  = new ProductInfoDocument();
    newData.name = this.name;
    newData.price = this.price;
    newData.stock = this.stock;
    newData.shopId = this.shopId;
    newData.createdAt = Iso8601.now();

    const newId = this.firestore.createId();
    newData.id = newId;
    //新規追加処理
    this.firestore.collection( "products" ).doc( newId ).set( Object.assign({}, newData) )
      .then(function( ){
        console.log('作成成功');

      })
      .catch(function( error ){
        console.error(error);
      });

  }

}
