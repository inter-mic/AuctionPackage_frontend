//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import {  TAdminPaddleShoninRequest } from '@/types/admin/paddle/management';
import { Errors } from '@/types/errors';



export const useOnlineBidShoninAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseStatus, setResponseStatus] = useState<number>(); 
  const onlineBidShoninAPI = async (paddleData: TAdminPaddleShoninRequest) => {
    const { status, data: responseData } = await apiRequest("admin", `paddle/onlineBitShonin`, 'POST', paddleData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseStatus(status);
    }
  };
  return { responseStatus, errors, onlineBidShoninAPI };
};
