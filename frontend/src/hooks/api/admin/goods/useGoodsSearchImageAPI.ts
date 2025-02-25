//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

import { GoodsImageData } from '@/types/admin/goods/register';



export const useGoodsSearchImageAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [fetchImages, setFetchImages] = useState<GoodsImageData[]>([]);
  const goodsSearchImage = async (goodsId: number) => {
    const endPoint = `goods/searchImage/${goodsId}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, "", true);
    
    if (status == 200 && responseData) {
        setFetchImages(responseData);
    }
  };

  return { fetchImages,  goodsSearchImage }
};