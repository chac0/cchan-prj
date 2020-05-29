import { Component, OnInit } from '@angular/core';
import { ProductInfoDocument, ShopDocument } from '../../models';
import { CSVExporter } from '../../mappers/product-csv';
import { ProductInfoDocRepository } from '../../repositories';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-product-csv-export',
  templateUrl: './product-csv-export.component.html',
  styleUrls: ['./product-csv-export.component.scss']
})
export class ProductCsvExportComponent implements OnInit {

  errorMsg: string;

  constructor( 
     private productInfoRepository: ProductInfoDocRepository
    ,private localStorageService: LocalStorageService
     ) { }

  ngOnInit() {
  }
  //========================
  // button:ダウンロード
  //========================
  onDownloadCSV(){
    this.errorMsg = '';
    this.productInfoRepository.getListOnce( this.localStorageService.shopDocument.id )
    .then(products=>{
      this._downloadCSV(products);
    })
    .catch(e=>{
      this.errorMsg = e;
    })
  }

  _downloadCSV( products: ProductInfoDocument[])
  {
    //データリストをcsv stringに変換
    const exporter:CSVExporter = new CSVExporter( products );
    //csvファイルとしてダウンロード
    this.onClickDownload(exporter.csvTableStr);

  }

  
  onClickDownload( data: any ) {

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, (<any>data)], { type: "text/csv" });
    let csvFileName = "商品情報.csv";

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = csvFileName;
    link.click();
    link.remove();

    // if (window.navigator.msSaveOrOpenBlob) {
    //     //IEの場合
    //     navigator.msSaveBlob(blob, csvFileName);
    // } else {
    //     //IE以外(Chrome, Firefox)
    //     let link = document.createElement("a");
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = csvFileName;

    //     // link.setAttribute("href", window.URL.createObjectURL(blob));
    //     // link.setAttribute("download", csvFileName);
    //     // document.body.appendChild(link);

    //     link.click();
    //     link.remove();
    // }    
  }  


}
