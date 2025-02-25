//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

import { GoodsImageData } from '@/types/admin/goods/register';



export const useGoodsSearchImageAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [fetchImages, setFetchImages] = useState<GoodsImageData[]>([]);
  const goodsSearchImage = async (goodsId: number, isLogin: boolean) => {
    const endPoint = `goods/searchImage/${goodsId}`;
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, endPoint, 'POST', null, "", true);
    
    if (status == 200 && responseData) {
        setFetchImages(responseData);
    }
  };

  return { fetchImages,  goodsSearchImage }
};