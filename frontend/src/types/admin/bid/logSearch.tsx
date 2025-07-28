export interface TLogBidAdminSearchRequest {
  goodsId?: string;
  goodsName?: string;
  sku?: string;
  categorySeq?: string;
  lotFrom?: string;
  lotTo?: string;
  auctionSeq?: string;
  userId?: string;
  userName?: string;
  paddleNo?: string;
  bidKbn?: string;
  pageNumber: number;
  pageSize: number;
  sortKey?: string;
  sortFlg?: boolean;
}

export interface TLogInternetBidAdminSearchRequest {
  goodsId?: string;
  goodsName?: string;
  sku?: string;
  categorySeq?: string;
  lotFrom?: string;
  lotTo?: string;
  auctionSeq?: string;
  userId?: string;
  userName?: string;
  paddleNo?: string;
  bidKbn?: string;
  pageNumber: number;
  pageSize: number;
  sortKey?: string;
  sortFlg?: boolean;
}

export interface TAdminLogBidSelect {
  seq: number;
  goodsId: number;
  sku: string;
  goodsName: string;
  userId: string;
  userName: string;
  paddleNo: number;
  auctionSeq: string;
  lot: number;
  bidPrice: number;
  bidTime: string;
  bidKbnName: string;
  [key: string]: any;
}
