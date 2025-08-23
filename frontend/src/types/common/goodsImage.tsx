export type TGoodsImageData = {
  goodsId: number | null;
  goodsImagesNo: number | null;
  sortNumber: number | null;
  thumbnailImageUrl: string | null;
  originalImageUrl: string | null;
  squareImageUrl: string | null;
};

export const initialGoodsImageData: TGoodsImageData = {
  goodsId: null,
  goodsImagesNo: null,
  sortNumber: null,
  thumbnailImageUrl: null,
  originalImageUrl: null,
  squareImageUrl: null,
};
