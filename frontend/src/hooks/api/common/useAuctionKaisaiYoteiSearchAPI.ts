import { useState, useEffect, useCallback } from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import {  TAuction } from '@/types/common/MtAuction';
import { Errors } from '@/types/errors';



export const useAuctionKaisaiYoteiSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [auctionKaisaiYoteiList, setAuctionKaisaiYoteiList] = useState<TAuction[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const auctionKaisaiYoteiSearchAPI = useCallback(async (isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, `auction/kaisaiYoteiList`, 'POST', null, "", true);
  if (status == 200 && responseData) {
      setAuctionKaisaiYoteiList(responseData);
    }
  },[apiRequest]);

  return { auctionKaisaiYoteiList, auctionKaisaiYoteiSearchAPI }
};