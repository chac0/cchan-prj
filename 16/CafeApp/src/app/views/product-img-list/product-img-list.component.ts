import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import { UploadData, StorageProductImgPath } from '../../models';
import { LocalStorageService } from '../../services/local-storage.service';
import { FileIO } from '../../utils/FileIO';
import { Tools } from '../../utils/Tools';
import { ProductImgListTemplateComponent } from '../../components/product-img-list-template/product-img-list-template.component';

@Component({
  selector: 'app-product-img-list',
  templateUrl: './product-img-list.component.html',
  styleUrls: ['./product-img-list.component.scss']
})
export class ProductImgListComponent implements OnInit {

  @ViewChild(ProductImgListTemplateComponent, {static: false})
  private imgListTemplate: ProductImgListTemplateComponent;

  errorMsg: string = '';
  upLoadDatas: UploadData[] = new Array();
  localUrls: string[] = new Array();
  showConfirmDialog: boolean = false;
  selectedFolder: string;
  uploading: boolean = false;
  canUpload: boolean = false;
  setUI: boolean = false;

  //アップロードを許可する拡張子
  allow_exts: string[] = new Array('jpg', 'jpeg', 'png');

  constructor(
     private storage: AngularFireStorage
    ,private localStorageService: LocalStorageService
  )
  {

  }

  ngOnInit() {

  }

  //===========================
  // 画像一覧を更新する
  //===========================
  onRefreshList(){
    this.imgListTemplate.refreshList();
  }

  //============================
  // フォルダ選択ボタンイベント:click
  // clickされた時にvalueをclearしないと
  // 同名フォルダが選択された時に起動しない
  //============================
  onSelectFolderClear( e: any ){
    e.target.value = '';
    this.uploading = false;
    this.showConfirmDialog = false;
  }

  //============================
  // フォルダ選択ボタンイベント:onChange
  //============================
  onSelectFolder( e: any )
  {
    this.openConfirmDialog( e );
  }

  async openConfirmDialog( e: any )
  {
    this.errorMsg = '';
    this.upLoadDatas = null;
    this.upLoadDatas = new Array();
    this.localUrls = null;
    this.localUrls = new Array();
    this.selectedFolder = '';

    //input text(見た目)にセットしたか
    this.setUI = false;

    for( let key in e.target.files )
    {
      const file = e.target.files[key];
      //最初の要素でテキストにセットする
      if(!this.setUI){
        var relativePath = file.webkitRelativePath;
        this.selectedFolder = FileIO.getFolderName(relativePath);
        this.setUI = true;
      }

      //ファイル拡張子のチェック（必ずnull objectが配列に混じるので）
      if( file.type == undefined || !FileIO.checkExt(file.name, this.allow_exts) ){
        continue;
      }
      let data = new UploadData();
      data.file = file;
      //ローカルurl取得
      try{
        const localResult = await this.readAsDataURL(file);
        data.localURL = localResult;
        this.upLoadDatas.push(data);
      }catch(e){ continue;}
    }

    if(this.upLoadDatas.length == 0){
      this.errorMsg = '指定フォルダに画像ファイルがないようです';
      this.showConfirmDialog = false;
      return;
    }

    //確認ダイアログの表示
    this.showConfirmDialog = true;

  }

  //===========================
  // local画像のurlを取得
  //===========================
  readAsDataURL( file : any ): Promise<string | ArrayBuffer> 
  {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = function() {
            resolve(fr.result);
        }
        fr.readAsDataURL(file);
    });
  }  


  //===========================
  // (event:click)
  //  確認ダイアログのキャンセルボタン
  //===========================
  onCancel(){
    this.showConfirmDialog = false;
  }

  //===========================
  // (event:click)
  //  確認ダイアログのアップロードボタン
  //===========================
  async onUpload(){
    this.uploading = true;
    await this.uploadFiles()
    .then(()=>{
      this.imgListTemplate.refreshList();
    })
    .catch((error)=>{
      this.errorMsg = error;
    })
    .finally(()=>{
      this.uploading = false;
      this.showConfirmDialog = false;
    });

  }

  //===========================
  // 指定ファイルリストを
  // firestoreに書き込みにいく
  //===========================
  async uploadFiles()
  {
    return new Promise(async(resolve, reject)=>{

      //配列を分割して３つずつ非同期アップロードする
      try{
        const divideNum = 3;
        let chukArray = Tools.chunkArray(this.upLoadDatas, divideNum);
        for( let index in chukArray )
        {
          let promiseList = new Array();
          let chunk = chukArray[index];
          for(let index2 in chunk ){
            //分割前のキー番号取得
            const orgIndex = (parseInt(index) * divideNum) + parseInt(index2);
            promiseList.push( this.DoUpload(orgIndex.toString()) );
          }
          await Promise.all( promiseList );

        }
        resolve();
      } catch(e){
        reject(e);
      }
    })

  }

  //===========================
  // アップロード処理本体
  //===========================
  async DoUpload( uploadIndex: string )
  {
    return new Promise((resolve, reject)=>{
      try{
          let uploadData = this.upLoadDatas[uploadIndex];
          const path = StorageProductImgPath(this.localStorageService.getShopDocument().id)+uploadData.file.name;

          uploadData.task = this.storage.upload(path, uploadData.file);
          uploadData.percentage = uploadData.task.percentageChanges();
          uploadData.percentage.subscribe((v)=>{
          if( v >= 100 ){
            resolve();
          }
        });
      }catch(e){
        reject(e);
      }
    });
  }

}
