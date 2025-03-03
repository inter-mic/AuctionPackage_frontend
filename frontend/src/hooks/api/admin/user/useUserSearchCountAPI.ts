//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { SearchParams } from '@/types/admin/member/search';



export const useUserSearchCountAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const userSearchCountAPI = async (searchParams: SearchParams) => {
    const endPoint = `user/count`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', searchParams, "", true);
    if (responseData) {
      setCount(responseData);
    }
  };
  return { count, userSearchCountAPI };
};