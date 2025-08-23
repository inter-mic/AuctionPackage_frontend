export type NextLotList = {
  goodsName: string | null;
  lot: number | null;
  startPrice: number | null;
  rakusatsuUserId: string | null;
  thumbnailImageUrl: string | null;
};
export const initialNextLotList: NextLotList = {
  goodsName: null,
  lot: null,
  startPrice: null,
  rakusatsuUserId: null,
  thumbnailImageUrl: null,
};
