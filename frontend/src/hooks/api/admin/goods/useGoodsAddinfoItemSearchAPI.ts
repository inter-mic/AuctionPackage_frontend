//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Result } from '@/types/admin/goods/addinfoItemSearch';



export const useGoodsAddinfoItemSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const goodsAddinfoItemSearch = async () => {
    const endPoint = 'goodsAddinfoItem/search';
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, "", true);
    if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, goodsAddinfoItemSearch }
};