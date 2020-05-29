import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
// import { AngularFireModule } from 'angularfire2';
import 'firebase/storage';
//
import { ImageInfo, StorageProductImgPath } from '../../models/storage-image-info';
import { LocalStorageService } from '../../services/local-storage.service';
import { FileIO } from '../../utils/FileIO';

@Component({
  selector: 'app-product-img-list-template',
  templateUrl: './product-img-list-template.component.html',
  styleUrls: ['./product-img-list-template.component.scss']
})
export class ProductImgListTemplateComponent implements OnInit {

  loading: boolean = false;
  public imageInfoList: ImageInfo[] = new Array();

  constructor( 
     private storage: AngularFireStorage
    ,private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {

    this.refreshList();

  }

  refreshList(){
    this.loading = true;
    this.imageInfoList = null;
    this.imageInfoList = new Array();

    const storagePath = StorageProductImgPath(this.localStorageService.shopDocument.id);
  
    //-------------------------------
    //特定パス以下のリストを取得
    //-------------------------------
    this.storage.storage.ref().child( storagePath ).listAll().then(result=>{

      if(this.loading){
        this.loading = false;
      }

      for( let item in result.items ){
        const imgRef = result.items[item];
        // 画像直リンurl取得
        imgRef.getDownloadURL().then(url=>{
          //表示用リストに追加
          let imgInfo = new ImageInfo();
          imgInfo.img_url = url;
          imgInfo.name = FileIO.getFileName(imgRef.fullPath);
          this.imageInfoList.push(imgInfo);
          
        })
      }
    })
    .catch((error:any)=>{console.log(error); this.loading = false;});
  }
  
}
