/* **************************************************
    ・商品情報をCSV化
    ・CSVから商品情報のクラスインスタンス化
***************************************************** */

import { ProductInfoDocument, ProductImageFolder } from '../models';

//===============================
//  カラムのCSV対応インデックス
//===============================
export enum E_CSV_COLUMNS {
    ID = 0,
    Name,
    Price,
    PriceType,
    Vat,
    Stock,
    ImgPath,
    ProductUrl,
    CreatedAt,
    UpdatedAt,
    ShopID,
    isDeliverable,
    ubiregiAccountId,
    ubiregiId,
}

//===============================
//  CSVヘッダ
//===============================
export const CSVHeader = function(){
    let list:string[] = [
        'ID'
        ,'商品名'
        ,'価格'
        ,'価格タイプ'
        ,'関税'
        ,'在庫'
        ,'商品画像'
        ,'商品URL'
        ,'登録日時'
        ,'最終更新日時'
        ,'ショップID'
        ,'宅配可/不可'
        ,'ユビレジアカウントID'
        ,'ユビレジID'
    ];
    return list.join(',');
}

export class CSVLoader {
    csvTable: ProductInfoDocument[];
    constructor( csvTableStr: string ){
        try{
            if( !(this.checkIsCSV(csvTableStr)) ){
                throw new Error('ファイルがCSV形式ではありません');
            }
            this.csvTable = new Array();
            let Rows: string[] = csvTableStr.split('\n');
            //_______________________________
            //csv table stringをパースする
            //------------------------------
            for( let key in Rows ){
                //一番上はheaderなので飛ばす
                if( key == '0' ){ continue;}
                const Row = Rows[key];
                if(Row == '' || Row == undefined || Row == null){continue;}
                //カラムをパース
                const parser = new CSVParser();
                parser.Parse(Row);
                this.csvTable.push(parser.csvData);
            }
        }catch(e){
            //console.log('error:'+ e);
            throw new Error(e);            
        }
    }
    //===============================
    //  正しいCSV形式かチェック
    //===============================
    checkIsCSV( csvText: string ):boolean{
        
        const ColCount = Object.keys(E_CSV_COLUMNS).length/2;
        let OKCnt = 0;
        let RowCount = 0;
        let Rows: string[] = csvText.split('\n');
        for(let key in Rows){
            //空の行は飛ばす
            if( Rows[key].length == 0 || Rows[key] == '' ){continue;}
            
            RowCount++;
            if(Rows[key].split(',').length == ColCount) {
                OKCnt++;
            }
        }
        if( OKCnt == RowCount ){ return true;}
        return false;
    }
}

export class CSVExporter{
    csvTableStr: string;
    constructor( csvTable: ProductInfoDocument[] ){
        this.csvTableStr = '';
        //ヘッダ追加
        this.csvTableStr += CSVHeader()+'\n';

        for( let key in csvTable ){
            const product = csvTable[key];
            const parser = new CSVParser();
            parser.csvData = product;
            this.csvTableStr += parser.ToCSV()+'\n';
        }
    }
}

export class CSVParser{

    public csvData: ProductInfoDocument;

    constructor(  ){
        this.csvData = new ProductInfoDocument();
    }


    //================================
    //メンバ変数をcsv stringに変換
    //================================
    ToCSV(): string{
        let Result:string = '';
        Result += this.csvData.id;
        Result += ','+this.csvData.name;
        Result += ','+this.csvData.price;
        Result += ','+this.csvData.priceType;
        Result += ','+this.csvData.vat;
        Result += ','+this.csvData.stock;
        // 「productImages/画像名」を「画像名」に置換
        Result += ','+this.csvData.imagePath.replace( ProductImageFolder, '' );
        Result += ','+this.csvData.productUrl;
        Result += ','+this.csvData.createdAt;
        Result += ','+this.csvData.updatedAt;
        Result += ','+this.csvData.shopId;
        Result += ','+this.csvData.isDeliverable;
        Result += ','+this.csvData.ubiregiAccountId;
        Result += ','+this.csvData.ubiregiId;

        return Result;
    }    

    //================================
    // csv stringをメンバ変数に変換
    //================================
    Parse( rowStr: string ){
        const columns = rowStr.split(',');
        for( let key in columns )
        {
            const index: number = parseInt(key);
            switch( index )
            {
                case E_CSV_COLUMNS.ID:{this.csvData.id = columns[key];break;}
                case E_CSV_COLUMNS.Name:{this.csvData.name = columns[key];break;}
                case E_CSV_COLUMNS.Price:{this.csvData.price = columns[key];break;}
                case E_CSV_COLUMNS.Vat:{this.csvData.vat = parseInt(columns[key]);break;}
                case E_CSV_COLUMNS.PriceType:{this.csvData.priceType = columns[key];break;}
                case E_CSV_COLUMNS.Stock:{this.csvData.stock = parseInt(columns[key]);break;}
                case E_CSV_COLUMNS.ImgPath:{this.csvData.imagePath = ProductImageFolder + columns[key];break;}
                case E_CSV_COLUMNS.ProductUrl:{this.csvData.productUrl = columns[key];break;}
                case E_CSV_COLUMNS.CreatedAt:{this.csvData.createdAt = columns[key];break;}
                case E_CSV_COLUMNS.UpdatedAt:{this.csvData.updatedAt = columns[key];break;}
                case E_CSV_COLUMNS.ShopID:{this.csvData.shopId = columns[key];break;}
                case E_CSV_COLUMNS.isDeliverable:{this.csvData.isDeliverable = (columns[key]=='true');break;}
                case E_CSV_COLUMNS.ubiregiAccountId:{this.csvData.ubiregiAccountId = columns[key];break;}
                case E_CSV_COLUMNS.ubiregiId:{this.csvData.ubiregiId = columns[key];break;}
            }
        }

    }
  
}

