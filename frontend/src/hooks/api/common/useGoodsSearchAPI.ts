//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import { TGoodsSearchRequest, TGoodsSelect } from '@/types/common/goods';
import { Errors } from '@/types/errors';



export const useGoodsSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [goodsList, setGoodsList] = useState<TGoodsSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const goodsSearchAPI = async (searchParams: TGoodsSearchRequest,isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, "goods/search", 'POST', searchParams, "", true, {}, true);
    
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setGoodsList(responseData);
    }
  };

  return { goodsList, errors, goodsSearchAPI }
};