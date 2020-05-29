export const ProductImageFolder = 'productImages/';
export const ShopImageFolder = 'shops/';

// shops/[shopid]/productImages/
export const StorageProductImgPath = function( shop_id: string ){
    return ShopImageFolder+ shop_id+'/'+ProductImageFolder;
}
//指定画像パスにフォルダがある場合のストレージパス
export const StorageProductImgPathWithFolder = function( shop_id: string ){
    return ShopImageFolder+ shop_id+'/';
}

export class ImageInfo{
    name: string;
    img_url: string;

}