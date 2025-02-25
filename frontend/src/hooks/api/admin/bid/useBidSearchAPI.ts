//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TGoodsAuctionBidAdminSearchRequest, Result } from '@/types/admin/bid/search';
import { Errors } from '@/types/errors';



export const useBidSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const bidSearch = async (searchParams: TGoodsAuctionBidAdminSearchRequest) => {
    const endPoint = 'goodsAuctionBid/search';
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', searchParams, "", true);
    
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, errors, bidSearch }
};