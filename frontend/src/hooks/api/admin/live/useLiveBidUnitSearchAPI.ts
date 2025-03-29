//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TMtLiveBidUnit } from '@/types/admin/live/bidUnit';



export const useLiveBidUnitSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [liveBidUnitList, setliveBidUnitList] = useState<TMtLiveBidUnit[]>([]);
  useEffect(() => {
    const liveBidUnitSearchAPI = async () => {

      const endPoint = `liveBidUnit/search`;
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        setliveBidUnitList(responseData);
      }
    };

    liveBidUnitSearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { liveBidUnitList };
};
