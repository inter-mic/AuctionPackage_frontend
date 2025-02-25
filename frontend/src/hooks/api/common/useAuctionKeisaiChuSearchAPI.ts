import { useState, useEffect, useCallback } from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import {  TAuction } from '@/types/common/MtAuction';

export const useAuctionKeisaiChuSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [auctionKeisaiChuList, setAuctionKeisaiChuList] = useState<TAuction[]>([]);
  const auctionKeisaiChuSearchAPI = useCallback(async (auctionSeq: number, isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, `auction/keisaiChu/${auctionSeq}`, 'POST', null, "", true, {}, false);
   if (status == 200 && responseData) {
    setAuctionKeisaiChuList(responseData);
    }
  } ,[apiRequest]);

  return { auctionKeisaiChuList,  auctionKeisaiChuSearchAPI }
};