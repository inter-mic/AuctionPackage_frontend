//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import { TGoodsSearchRequest } from '@/types/common/goods';
import { Errors } from '@/types/errors';



export const useGoodsCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [goodsCount, setGoodsCount] = useState<number | 0>(0);
  const [errors, setErrors] = useState<Errors>();
  const goodsCountAPI = async (searchParams: TGoodsSearchRequest,isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(endPointKbn, "goods/count", 'POST', searchParams, "", true, {}, false);
    
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setGoodsCount(responseData);

    }
  };

  return { goodsCount, errors, goodsCountAPI }
};