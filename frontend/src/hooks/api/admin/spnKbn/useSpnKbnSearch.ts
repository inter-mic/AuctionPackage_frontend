//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { SpnKbnData } from '@/types/admin/spnKbn/search';

export const useSpnKbnSearch = () => {
  const { useState,useEffect,useCallback ,useRouter,texts,  apiRequest } = useCommonSetup();
  const [spnKbn, setSpnKbn] = useState<SpnKbnData[]>([]);
  useEffect(() => {
    const SpnKbnSearch = async () => {

      const endPoint = `spnKbn/search`;
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        setSpnKbn(responseData);
      }
    };

    SpnKbnSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { spnKbn};
};