//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

import { TGoodsImageData } from "@/types/common/goodsImage";

export const useGoodsSearchImageAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [fetchImages, setFetchImages] = useState<TGoodsImageData[]>([]);
  const goodsSearchImage = async (goodsId: number, isLogin: boolean) => {
    const endPoint = `goods/searchImage/${goodsId}`;
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(
      endPointKbn,
      endPoint,
      "POST",
      null,
      "",
      true
    );

    if (status == 200 && responseData) {
      setFetchImages(responseData);
    }
  };

  return { fetchImages, goodsSearchImage };
};
