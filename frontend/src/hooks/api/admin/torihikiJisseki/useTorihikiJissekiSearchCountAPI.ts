//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TMemberTorihikiJissekiRequest, TVTorihikiJisseki } from '@/types/member/invoice';

export const useTorihikiJissekiSearchCountAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const torihikiJissekiSearchCountAPI = async (searchParams: TMemberTorihikiJissekiRequest) => {
    const { status, data: responseData } = await apiRequest("admin", 'torihikiJisseki/count', 'POST', searchParams, "", true);
    if (status == 200 && responseData) {
      setCount(responseData);
    }
  };

  return { count, torihikiJissekiSearchCountAPI }
};