export interface LogInternetBidAdminSearchRequest {
    goodsId?: string;
    goodsName?: string;
    sku?: string;
    categorySeq?: string;
    lotFrom?: string;
    lotTo?: string;
    auctionSeq?: string;
    userId?:  string;
    userName?:  string;
    pageNumber:number;
    pageSize:number;
    sortKey?: string;
    sortFlg?:boolean;
}


export interface TAdminLogInternetBidSelect {
    seq: number;
    goodsId: number;
    sku: string;
    goodsName: string;
    userId:  string;
    userName:  string;
    auctionSeq: string;
    lot: number;
    bidPrice: number;
    bidTime: string;
    [key: string]: any; 
}