export type TGoodsData = {
  goodsId: number | null;
  sku: string | null;
  goodsName: string | null;
  goodsSetsumei: string | null;
  categorySeq: number | null;
  biko: string | null;
  adminBiko: string | null;
  chumokuFlg: boolean | null;
  keisaiFlg: boolean | null;
  auctionSeq: number | null;
  spnKbn: string | null;
  shimeTime: string | null;
  lot: string | null;
  shuppinUserId: number | null;
  shuppinUserName: string | null;
  shuppinCompanyName: string | null;
  startPrice: string | null;
  currentPrice: string | null;
  currentKenriUserId: number | null;
  currentKenriUserName: string | null;
  currentKenriCompanyName: string | null;
  saiteiRakusatsuPrice: string | null;
  bidUnit: string | null;
  bidStarttime: string | null;
  bidEndtime: string | null;
  displayStarttime: string | null;
  displayEndtime: string | null;
  displayTime: string | null;
  bidTime: string | null;
  favoriteCount: string | null;
  bidCount: string | null;
  connectionCount: string | null;
  addInfo1: string | null;
  addInfo2: string | null;
  addInfo3: string | null;
  addInfo4: string | null;
  addInfo5: string | null;
  addInfo6: string | null;
  addInfo7: string | null;
  addInfo8: string | null;
  addInfo9: string | null;
  addInfo10: string | null;
  thumbnailImageUrl: string | null;
  updateTimeTtGoods: string | null;
  updateTimeTtGoodsAuction: string | null;
  updateTimeTtGoodsAddinfo: string | null;
};
export const initialGoodsData: TGoodsData = {
  goodsId: null,
  sku: null,
  goodsName: null,
  goodsSetsumei: null,
  categorySeq: null,
  biko: null,
  adminBiko: null,
  chumokuFlg: false,
  keisaiFlg: true,
  auctionSeq: null,
  spnKbn: null,
  shimeTime: null,
  lot: null,
  shuppinUserId: null,
  shuppinUserName: null,
  shuppinCompanyName: null,
  startPrice: null,
  currentPrice: null,
  currentKenriUserId: null,
  currentKenriUserName: null,
  currentKenriCompanyName: null,
  saiteiRakusatsuPrice: null,
  bidUnit: null,
  bidStarttime: null,
  bidEndtime: null,
  displayStarttime: null,
  displayEndtime: null,
  displayTime: null,
  bidTime: null,
  favoriteCount: "0",
  bidCount: "0",
  connectionCount: "0",
  addInfo1: null,
  addInfo2: null,
  addInfo3: null,
  addInfo4: null,
  addInfo5: null,
  addInfo6: null,
  addInfo7: null,
  addInfo8: null,
  addInfo9: null,
  addInfo10: null,
  thumbnailImageUrl: null,
  updateTimeTtGoods: null,
  updateTimeTtGoodsAuction: null,
  updateTimeTtGoodsAddinfo: null,
};

export type TGoodsKekkaData = {
  goodsId: number | null;
  rakusatsuPrice: string | null;
  rakusatsuTesuryoPrice: string | null;
  rakusatsuUserId: number | null;
  rakusatsuUserName: string | null;
  rakusatsuCompanyName: string | null;
  kekkaRegisttime: string | null;
  auctionKekkaStatus: number | null;
  updateTimeTtGoodsAuction: string | null;
};

export const initialGoodsKekkaData: TGoodsKekkaData = {
  goodsId: null,
  rakusatsuPrice: null,
  rakusatsuTesuryoPrice: null,
  rakusatsuUserId: null,
  rakusatsuUserName: null,
  rakusatsuCompanyName: null,
  kekkaRegisttime: null,
  auctionKekkaStatus: null,
  updateTimeTtGoodsAuction: null,
};
