//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import {  TGoodsSelect } from '@/types/common/goods';



export const useGoodsSearchSomeCategoryAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [goodsList, setGoodsList] = useState<TGoodsSelect[]>([]);
  const goodsSearchSomeCategoryAPI = async (auctionSeq: number, categorySeq: number, isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const params = {
      auctionSeq: auctionSeq,
      categorySeq: categorySeq,
  };
    const { status, data: responseData } = await apiRequest(endPointKbn, "goods/searchSomeCategory", 'POST', params, "", true);
    
    if (status == 200 && responseData) {
      setGoodsList(responseData);
    }
  };

  return { goodsList,  goodsSearchSomeCategoryAPI }
};