export type TSpnSearchRequest = {
  goodsName?: string;
  auctionSeq?: string;
  lot?: string;
  auctionKekka?: string;
};

export type TSpnSelect = {
  thumbnailImageUrl: string;
  goodsId: number;
  spnKbn: string;
  goodsName: string;
  lot: string;
  startPrice: string;
  currentPrice: string;
  rakusatsuPrice: string;
  auctionKekkaStatusName: string;
  isDisplayKikan: boolean;
  [key: string]: any;
};
