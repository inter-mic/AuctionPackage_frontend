//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { SearchParams, Result } from '@/types/admin/member/search';



export const useUserSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const userSearch = async (searchParams: SearchParams) => {
    const endPoint = `user/search`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', searchParams, "", true);
    if (responseData) {
      setData(responseData);
    }
  };
  return { data, userSearch };
};