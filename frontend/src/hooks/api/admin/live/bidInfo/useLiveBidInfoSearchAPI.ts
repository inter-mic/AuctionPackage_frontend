//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { LiveBidInfoData, initialLiveBidInfoData } from '@/types/admin/live/bidInfo';
import { Errors } from '@/types/errors';


export const useLiveBidInfoSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [liveBidInfoSearchErrors, setLiveBidInfoSearchErrors] = useState<Errors>();
  const [fetchLiveBidInfoData, setFetchliveBidInfoData] = useState<LiveBidInfoData>(initialLiveBidInfoData);

  const liveBidInfoSearchAPI = async (auctionSeq: string , lotFrom:string, lotTo:string) => {

    const endPoint = `liveBidInfo/search`;
    const requestBody = { auctionSeq, lotFrom, lotTo };
    const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', requestBody, "", true);
    if (status == 400) {
      setLiveBidInfoSearchErrors(responseData);
    } else if (status == 200 && responseData) {
      setFetchliveBidInfoData(responseData[0]);
    }
  };

  return { fetchLiveBidInfoData, liveBidInfoSearchErrors, liveBidInfoSearchAPI };
};
