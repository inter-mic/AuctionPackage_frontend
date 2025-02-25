//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { auctionData } from '@/types/admin/auction/register';
export const useAuctionGetInfoAPI = () => {
  const { useState,useEffect,useCallback ,useRouter,texts,  apiRequest } = useCommonSetup();
  const [data, setData] = useState<auctionData>();
  const auctionGetInfo = async (auctionSeq: number) => {

    const endPoint = `auction/search/${auctionSeq}`;
    const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
    if (responseData) {
      setData(responseData[0]);
    }
  };

  return { data, auctionGetInfo };
};