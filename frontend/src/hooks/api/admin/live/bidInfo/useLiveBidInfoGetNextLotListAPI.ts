//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { GoodsData, initialGoodsData } from '@/types/admin/goods/register';
import { Errors } from '@/types/errors';


export const useLiveBidInfoGetNextLotListAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [liveBidInfoGetNextLotListErrors, setLiveBidInfoGetNextLotListErrors] = useState<Errors>();
  const [fetchLiveBidNextLotListData, setFetchLiveBidNextLotListData] = useState<GoodsData[]>([]);

  const liveBidInfoGetNextLotListAPI = async (flg: boolean,  goodsId: number, auctionSeq: string , lotFrom:string) => {

    let endPoint = '';
    let requestBody = {};
    if (flg) {
      endPoint = `liveBidInfo/getNextLotListById/${goodsId}`;
    } else {
      endPoint = `liveBidInfo/getNextLotList`;
      requestBody = { auctionSeq, lotFrom };
    }
    const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', requestBody, "", true);
    if (status == 400) {
      setLiveBidInfoGetNextLotListErrors(responseData);
    } else if (status == 200 && responseData) {
      setFetchLiveBidNextLotListData(responseData);
    }
  };

  return { fetchLiveBidNextLotListData, liveBidInfoGetNextLotListErrors, liveBidInfoGetNextLotListAPI };
};
