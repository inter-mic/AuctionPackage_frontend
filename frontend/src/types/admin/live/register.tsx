export type LiveBidKekkaData = {
    goodsId: number | null;
    rakusatsuPrice: string | null | undefined;
    rakusatsuUserId: number | null | undefined;
    auctionKekkaStatus: number | null;
};

export const initialLiveBidKekkaData: LiveBidKekkaData = {
    goodsId: null,
    rakusatsuPrice: null,
    rakusatsuUserId: null,
    auctionKekkaStatus: 1
};