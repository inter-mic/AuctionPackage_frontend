export interface TGoodsAuctionBidAdminSearchRequest {
    goodsId?: string;
    goodsName?: string;
    sku?: string;
    categorySeq?: string;
    lotFrom?: string;
    lotTo?: string;
    auctionSeq?: string;
    userId?:  string;
    userName?:  string;
}


export interface Result {
    goodsId: number;
    goodsName: string;
    sku: string;
    userId:  string;
    userName:  string;
    auctionName: string;
    lot: number;
    bidPrice: number;
    bidTime: string;
    [key: string]: any; 
}