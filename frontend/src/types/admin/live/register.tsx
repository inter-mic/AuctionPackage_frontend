export type LiveBidKekkaData = {
  goodsId: number | null;
  rakusatsuPrice: string | null | undefined;
  rakusatsuUserId: number | null | undefined;
  rakusatsuPaddleNo: string | null | undefined;
  auctionKekkaStatus: number | null;
};

export const initialLiveBidKekkaData: LiveBidKekkaData = {
  goodsId: null,
  rakusatsuPrice: null,
  rakusatsuUserId: null,
  rakusatsuPaddleNo: "",
  auctionKekkaStatus: 1,
};
