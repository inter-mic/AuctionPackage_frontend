//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import {  TAuction } from '@/types/common/MtAuction';



/*kaisaiStatus
1：入札開始

*/

export const useAuctionSearchAPI = (kaisaiStatus: number,isLogin: boolean) => {
  const endPointKbn = `${isLogin ? "member" : "public"}`;
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [auction, setAuction] = useState<TAuction[]>([]);
  useEffect(() => {
    const auctionSearch = async (auctionSeq: number) => {

      var endPoint = "" ;
      if (kaisaiStatus == 1){
        endPoint = `auction/kaisaiBidStartList`;
      } 
      const { status, data: responseData } = await apiRequest( endPointKbn, endPoint, 'POST', null, "", true);
      if (responseData) {
        setAuction(responseData);
      }
    };

    auctionSearch(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kaisaiStatus]);

  return { auction };
};