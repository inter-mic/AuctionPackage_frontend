//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

import { TGoodsImageData } from "@/types/common/goodsImage";

export const useGoodsSearchImageAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [fetchImages, setFetchImages] = useState<TGoodsImageData[]>([]);

  const goodsSearchImage = async (goodsId: number) => {
    const endPoint = `goods/searchImage/${goodsId}`;
    const { status, data: responseData } = await apiRequest(
      "admin",
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
