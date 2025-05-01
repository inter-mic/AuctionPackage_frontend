//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TAdminPaddleSearchRequest } from '@/types/admin/paddle/management';

export const usePaddleSearchCountAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const paddleSearchCountAPI = async (searchParams: TAdminPaddleSearchRequest) => {
    const endPoint = `user/count`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', searchParams, "", true);
    if (responseData) {
      setCount(responseData);
    }
  };
  return { count, paddleSearchCountAPI };
};