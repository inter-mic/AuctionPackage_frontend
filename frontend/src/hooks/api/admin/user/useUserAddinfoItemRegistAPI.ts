import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useUserAddinfoItemRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const userAddinfoItemRegistAPI = async (seq: any, UserAddinfo: any)=>{
    const endPoint = `userAddinfoItem/update/${seq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', UserAddinfo, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }
  };
  return { userAddinfoItemRegistAPI };
};
  
export default useUserAddinfoItemRegistAPI;