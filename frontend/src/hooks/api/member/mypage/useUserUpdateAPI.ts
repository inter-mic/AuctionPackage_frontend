//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const useUserUpdateAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const userUpdateAPI = async (UserData: any) => {
    
    const { status, data: responseData } = await apiRequest("member", 'user/update', 'POST', UserData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } 
  };
  return {  errors, userUpdateAPI };
};
