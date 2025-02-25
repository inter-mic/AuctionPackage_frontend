export type TResultsSearchRequest = {
    goodsName?: string;
    auctionSeq?: string;
    lot?: string;
}

export type TResultsSelect = {
    thumbnailImageUrl: string;
    goodsId: number;
    goodsName: string;    
    lot: string;
    rakusatsuPrice: string;
    [key: string]: any; 
}