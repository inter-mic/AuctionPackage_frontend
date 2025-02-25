export type TAdminTorihikiJissekiRequest = {
    auctionSeq?: number;
    userId?:  number;
}


export type TVTorihikiJisseki ={
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

export type TTorihikiJissekiMeisaiRakusatsuSelect ={
    userId: string;
    userName: string;
    companyName: string;
    goodsId: number;
    sku: string;
    goodsName: string;
    goodsSetsumei: string;
    categoryName: string;
    biko: string;
    auctionSeq: string;
    auctionName: string;
    shimeTime: string;
    lot: string;
    addInfo1: string;
    addInfo2: string;
    addInfo3: string;
    addInfo4: string;
    addInfo5: string;
    addInfo6: string;
    addInfo7: string;
    addInfo8: string;
    addInfo9: string;
    addInfo10: string;
    rakusatsuPrice: string;
    rakusatsuTesuryoPrice: string;
    rakusatsuTotalPrice: string;
    rakusatsuKessaibi: string;
    rakusatsuHassobi: string;
    [key: string]: any; 
}

export type TTorihikiJissekiMeisaiShuppinSelect ={
    userId: string;
    userName: string;
    companyName: string;
    goodsId: number;
    sku: string;
    goodsName: string;
    goodsSetsumei: string;
    categoryName: string;
    biko: string;
    auctionSeq: string;
    auctionName: string;
    shimeTime: string;
    lot: string;
    addInfo1: string;
    addInfo2: string;
    addInfo3: string;
    addInfo4: string;
    addInfo5: string;
    addInfo6: string;
    addInfo7: string;
    addInfo8: string;
    addInfo9: string;
    addInfo10: string;
    rakusatsuUserId: string;
    shuppinPrice: string;
    shuppinTesuryoPrice: string;
    shuppinTotalPrice: string;
    shuppinKessaibi: string;
    [key: string]: any; 
}