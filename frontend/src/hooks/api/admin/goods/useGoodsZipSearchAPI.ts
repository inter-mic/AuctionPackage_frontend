//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Result } from '@/types/admin/goods/zipSearch';



export const useGoodsZipSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const goodsZipSearch = async () => {
    const endPoint = 'goodszip/search';
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, "", true);
    if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, goodsZipSearch }
};