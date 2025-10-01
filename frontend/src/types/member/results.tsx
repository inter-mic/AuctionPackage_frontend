export type TResultsSearchRequest = {
  goodsName?: string;
  auctionSeq?: string;
  lot?: string;
};

export type TResultsSelect = {
  goodsId: number;
  goodsName: string;
  lot: string;
  rakusatsuPrice: string;
  thumbnailImageUrl: string;
  displayKikan: boolean;
  [key: string]: any;
};
