//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const useKengenGroupDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [kengenDeleteErrors, setErrors] = useState<Errors>();
  const [responseDeleteData, setResponseData] = useState(null);
  const kengenGroupDelete = async (kengenId:number) => {
    const endPoint = `kengenGroup/delete/${kengenId}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { responseDeleteData, kengenDeleteErrors, kengenGroupDelete };
};
