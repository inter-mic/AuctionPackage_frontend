//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

export const useCheckLiveAuctionAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [ isLiveAuction, setIsLiveAuction] = useState<boolean>(false); 
  useEffect(() => {
    const checkLiveAuctionAPI = async () => {
      const { data: responseData } = await apiRequest( "member", `live/checkLiveAuction`, 'POST', null, "", true);
      if (responseData) {
        setIsLiveAuction(responseData);
      }
    };
    checkLiveAuctionAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLiveAuction };
};