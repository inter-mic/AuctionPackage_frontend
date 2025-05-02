export interface TAdminPaddleSearchRequest {
    userId?: string;
    auctionSeq?: string;
    userName?: string;
    paddleKbn?: string;
    paddleNo?: string;
    pageNumber: number;
    pageSize: number;
    sortKey?: string;
    sortFlg?: boolean;
}

export interface TAdminPaddleSelect {
    auctionSeq: number;
    userId: number;
    userName: string;
    companyName: string;
    auctionName: string;
    fullAddress: string;
    paddleKbn: number;
    paddleKbnName: string;
    paddleNo: number;
    [key: string]: any;
}

export interface TAdminNextPaddleSearchRequest {
    auctionSeq?: string;
    paddleKbn?: string;
}


export interface TAdminPaddleRegistRequest {
    userId?: number;
    userName?: string;
    companyName?: string;
    auctionSeq?: string | undefined;
    paddleKbn?: string | undefined;
    paddleNo?: string | undefined;
}
