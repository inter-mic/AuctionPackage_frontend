export type LiveBidInfoData = {
    goodsId: number | null;
    auctionSeq: number | null;
	lot: string | null;
	startPrice: string | null;
	saiteiRakusatsuPrice: string | null;
	bidUnit: string | null;
	firstPreBidUserId: number | null;
	firstPreBidPrice: string | null;
	firstPreBidTime: string | null;
	secondPreBidUserId: number | null;
	secondPreBidPrice: string | null;
	secondPreBidTime: string | null;
	currentPrice: string | null;
	nextPrice: string | null;
	kenriUserId: number | null;
}

export const initialLiveBidInfoData: LiveBidInfoData = {
    goodsId:null,
    auctionSeq:null,
	lot:null,
	startPrice:null,
	saiteiRakusatsuPrice:null,
	bidUnit:null,
	firstPreBidUserId:null,
	firstPreBidPrice:null,
	firstPreBidTime:null,
	secondPreBidUserId:null,
	secondPreBidPrice:null,
	secondPreBidTime:null,
	currentPrice:null,
	nextPrice:null,
	kenriUserId:null
}

export type TAdminLiveBidInfoSearchRequest = {
    auctionSeq: number;
    lot: string;
}