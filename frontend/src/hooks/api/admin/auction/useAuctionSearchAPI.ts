import  dayjs,{ Dayjs } from 'dayjs';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TMtAuction } from '@/types/admin/auction/search';


/*kaisaiStatus
0, null：全開催回
1：開催回指定
2：掲載中開催回
3：締め前開催回
4：締め済み開催回
*/

export const useAuctionSearchAPI = (kaisaiStatus: number, spnKbn: number) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [auction, setAuction] = useState<TMtAuction[]>([]);
  useEffect(() => {
    const auctionSearch = async (auctionSeq: number) => {

      var endPoint = "" ;
      if (kaisaiStatus == 1){
        endPoint = `auction/search/${auctionSeq}`;
      } else if (kaisaiStatus == 2){
        endPoint = `auction/searchKeisai`;
      } else if (kaisaiStatus == 3){
        endPoint = `auction/searchShimemae`;
      } else if (kaisaiStatus == 4){
        endPoint = `auction/searchShimezumi`;
      } else{
        endPoint = `auction/search`;
      }
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        const transformedData = responseData.map((data: any) => ({
          ...data,
          displayEndtime: data.displayEndtime ? dayjs(data.displayEndtime) : null,
        }));
        setAuction(transformedData);
      }
    };

    auctionSearch(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kaisaiStatus]);

  return { auction };
};