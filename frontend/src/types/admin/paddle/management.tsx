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
    auctionSeq: string;
    userId: string;
    userName: string;
    companyName: string;
    auctionName: string;
    fullAddress: string;
    paddleKbn: string;
    paddleKbnName: string;
    paddleNo: string;
    onlinebidShohinFlg: boolean;
    [key: string]: any;
}

export interface TAdminNextPaddleSearchRequest {
    auctionSeq?: string;
    paddleKbn?: string;
}


export interface TAdminPaddleRegistRequest {
    userId?: string;
    userName?: string;
    companyName?: string;
    auctionSeq?: string;
    paddleKbn?: string;
    paddleNo?: string;
}

export const initialTAdminPaddleRegistRequest: TAdminPaddleRegistRequest = {
    userId: "",
    userName: "",
    companyName: "",
    auctionSeq: "",
    paddleKbn: "",
    paddleNo: ""
};

export interface TAdminPaddleShoninRequest {
    userId?: string;
    auctionSeq?: string;
    paddleNo?: string;
    paddleKbn?: string;
}

export const initialTAdminPaddleShoninRequest: TAdminPaddleShoninRequest = {
    userId: "",
    auctionSeq: "",
    paddleNo: ""
};
