import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useGoodsAddinfoItemRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const goodsAddinfoItemRegistAPI = async (seq: any, GoodsAddinfo: any)=>{
    const endPoint = `goodsAddinfoItem/update/${seq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', GoodsAddinfo, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }
  };
  return { goodsAddinfoItemRegistAPI };
};
  
export default useGoodsAddinfoItemRegistAPI;