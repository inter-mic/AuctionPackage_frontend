export type TMarketSearchRequest = {
  goodsId?: string;
  auctionKikanFrom?: string;
  auctionKikanTo?: string;
  categorySeq?: string;
  rakusatsuPriceFrom?: string;
  rakusatsuPriceTo?: string;
  freeWord?: string;
  pageNumber: number;
  pageSize: number;
  sortKey?: string;
  sortFlg?: boolean;
};

export type TMarketSelect = {
  thumbnailImageUrl: string;
  originalImageUrl: string;
  squareImageUrl: string;
  goodsId: number;
  goodsName: string;
  goodsSetsumei: string;
  categorySeq: number;
  categoryName: string;
  biko: string;
  auctionSeq: number;
  auctionName: string;
  auctionDatetime: string;
  startPrice: string;
  bidCount: number;
  rakusatsuPrice: string;
  [key: string]: any;
};
