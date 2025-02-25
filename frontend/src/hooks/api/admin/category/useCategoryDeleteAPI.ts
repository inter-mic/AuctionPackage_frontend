import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useCategoryDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const categoryDelete = async (categorySeq: any)=>{
    const endPoint = `category/delete/${categorySeq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }else if (status == 500) {
      setErrors(responseData);
    }else if (status == 200){
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { categoryDelete };
};
  
export default useCategoryDeleteAPI;