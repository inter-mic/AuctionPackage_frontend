import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useCategoryRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState(null);
  const categoryRegist = async (categorySeq: any, categoryName: any)=>{
    const endPoint = categorySeq
      ? `category/update/${categorySeq}`
      : 'category/insert';
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', categoryName, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }else if (status == 500) {
      setErrors(responseData);
    }else if (status == 200) {
      setResponseData(responseData);
      if(!categorySeq){
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };
  return { responseData, errors, categoryRegist };
};
  
export default useCategoryRegistAPI;