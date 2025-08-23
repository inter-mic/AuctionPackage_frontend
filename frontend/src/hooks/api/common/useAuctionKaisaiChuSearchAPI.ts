import { useCallback } from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import {  TAuction } from '@/types/common/MtAuction';

export const useAuctionKaisaiChuSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [auctionKaisaiChuList, setAuctionKaisaiChuList] = useState<TAuction[]>([]);
  const auctionKaisaiChuSearchAPI = useCallback(async (isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, `auction/kaisaiChu`, 'POST', null, "", true);
   if (status == 200 && responseData) {
      setAuctionKaisaiChuList(responseData);
    }
  } ,[apiRequest]);

  return { auctionKaisaiChuList,  auctionKaisaiChuSearchAPI }
};