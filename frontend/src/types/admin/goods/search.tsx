export interface TAdminGoodsSearchRequest {
    goodsId?: string;
    goodsName?: string;
    sku?: string;
    categorySeq?: string;
    lotFrom?: string;
    lotTo?: string;
    auctionSeq?: string;
    keisaiFlg?:  string;
    kekkaStatus?: string;
    shuppinUserId?:  string;
    shuppinUserName?: string;
    rakusatsuUserId?:  string;
    rakusatsuUserName?:  string;
    freeWord?: string;
}


export interface TAdminGoodsSelect {
    thumbnailImageUrl: string;
    goodsId: number;
    goodsName: string;
    sku: string;
    lot: number;
    displayTime: string;
    bidTime: string;
    startPrice: number;
    currentPrice: number;
    favoriteCount: number;
    bidCount: number;
    auctionKekkaStatusStr: string;
    shuppinUserId: string;
    rakusatsuUserId: string;
    [key: string]: any; 
}