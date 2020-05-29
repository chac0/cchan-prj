//開発中などに使う便利な関数集
export class Tools{

    //========================
    // 一定時間waitする
    // async関数で使うのが無難
    // async func(){ await Tools.wait(); }
    //========================
    static wait(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    //========================
    // 配列を指定の数ずつ分割する
    //========================
    static chunkArray(targetArray, chunk_size){
        var index = 0;
        var arrayLength = targetArray.length;
        var tempArray = [];
        
        for (index = 0; index < arrayLength; index += chunk_size) {
            var tmpChunk = targetArray.slice(index, index+chunk_size);
            tempArray.push(tmpChunk);
        }
    
        return tempArray;
    }    

}