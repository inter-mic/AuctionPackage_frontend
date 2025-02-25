//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const useMemberSignUpAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();
  const userRegist = async (UserData: any) => {
    
    const { status, data: responseData } = await apiRequest("public", 'memberSignUp/insert', 'POST', UserData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      router.push('./signupCompletion'); 
    }
  };
  return { responseData, errors, userRegist };
};
