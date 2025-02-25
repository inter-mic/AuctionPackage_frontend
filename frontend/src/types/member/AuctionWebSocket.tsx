export type TAuctionWebSocketData ={
    goodsId: number;
    remainingTime: string;
    bidEndtime: string;
    startCurrentPrice: string;
    currentKenriUserId: number;
    auctionTimeStatus: number;
    bidPrice: string;
    nextBidPrice: string;
    bidUserId: number;
    bidCount: number;
    auctionBidFlg: boolean;
    saiteiRakusatsuPriceOverFlg: boolean;
}