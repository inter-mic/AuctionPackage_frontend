import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useMailShomeiRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [shomeiErrors, setErrors] = useState<Errors>();
  const [shomeiResponseData, setResponseData] = useState(null);
  const shomeiRegist = async (mailShomeis: any)=>{
    const endPoint = `mailShomei/update`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', mailShomeis, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }else if (status == 500) {
      setErrors(responseData);
    }else if(status == 200){
      setResponseData(responseData);
    }  
  };
  return { shomeiResponseData, shomeiErrors, shomeiRegist };
};
  
export default useMailShomeiRegistAPI;