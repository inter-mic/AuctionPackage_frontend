export type TMemberTorihikiJissekiRequest = {
    auctionSeq?: number;
    pageNumber:number;
    pageSize:number;
    sortKey?: string;
    sortFlg?:boolean;
}


export type TVTorihikiJisseki ={
    auctionName: string;
    auctionSeq: number;
    userId: number;
    userName: string;
    companyName: string;
    shuppinsu: number;
    shuppinPrice: string;
    shuppinTesuryoPrice: string;
    shuppinTotalPrice: string;
    rakusatsusu: number;
    rakusatsuPrice: string;
    rakusatsuTesuryoPrice: string;
    rakusatsuTotalPrice: string;
    [key: string]: any; 
}
