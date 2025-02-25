//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const useKengenGroupRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [kengenRegistErrors, setErrors] = useState<Errors>();
  const [responseRegistData, setResponseData] = useState(null);
  const kengenGroupRegist = async (kengenId:number, KengenData: any) => {
    const endPoint = `kengenGroup/update/${kengenId}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', KengenData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
    }
  };
  return { responseRegistData, kengenRegistErrors, kengenGroupRegist };
};
