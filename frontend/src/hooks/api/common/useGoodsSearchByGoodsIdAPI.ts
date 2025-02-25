//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import {  TGoodsSelect } from '@/types/common/goods';
import { Errors } from '@/types/errors';


export const useGoodsSearchByGoodsIdAPI = () => {
  const { useState,  apiRequest } = useCommonSetup();
  const [goodsSearchErrors, setGoodsSearchErrors] = useState<Errors>();
  const [fetchGoodsData, setFetchGoodsData] = useState<TGoodsSelect>(); 
  const goodsSearchByGoodsIdAPI = async ( goodsId: number, isLogin: boolean) => {
    
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, `goods/findGoodsById/${goodsId}`, 'POST', null, "", true);
    if (status == 400) {
 
    } else if (status == 200 && responseData) {
      setFetchGoodsData(responseData[0]);
      
    }
  };

  return { fetchGoodsData, goodsSearchErrors, goodsSearchByGoodsIdAPI }
};