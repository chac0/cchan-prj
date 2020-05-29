export class FileIO {
  //======================================
  //ファイル名の拡張子が
  //許可されているか確認する関数
  //======================================
  static checkExt(filename:string, allow_exts:string[]):boolean
  {
    //比較のため小文字にする
    var ext = this.getExt(filename).toLowerCase();
    //許可する拡張子の一覧(allow_exts)から対象の拡張子があるか確認する
    if (allow_exts.indexOf(ext) === -1) return false;
    return true;
  }

  //======================================
  //ファイル名から拡張子を取得する関数
  //======================================
  static getExt(filename: string):string
  {
    let pos = filename.lastIndexOf('.');
    if (pos === -1) return '';
    return filename.slice(pos + 1);
  }  

  //======================================
  //パスからファイル名（拡張子込み）のみを抽出する
  //======================================
  static getFileName( fullPath: string ): string
  {
    return fullPath.replace(/^.*[\\\/]/, '');
  }

  //======================================
  //パスから最後のフォルダ名のみを抽出する
  //======================================
  static getFolderName( fullPath: string ): string{
    return fullPath.substring(0, fullPath.lastIndexOf('/'))+'/';
  }

}
