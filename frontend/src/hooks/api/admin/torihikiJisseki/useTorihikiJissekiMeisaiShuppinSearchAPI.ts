//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TAdminTorihikiJissekiRequest,  TTorihikiJissekiMeisaiShuppinSelect } from '@/types/admin/torihikiJisseki/search';
import { Errors } from '@/types/errors';


export const useTorihikiJissekiMeisaiShuppinSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [shuppinList, setShuppinList] = useState<TTorihikiJissekiMeisaiShuppinSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const torihikiJissekiMeisaiShuppinSearchAPI = async (searchParams: TAdminTorihikiJissekiRequest) => {    
    const { data: shuppinResponseData } = await apiRequest("admin", `torihikiJissekiMeisai/shuppin`, 'POST', searchParams, "", true);
    
    if(shuppinResponseData){
      setShuppinList(shuppinResponseData);    
    }
  };

  return { shuppinList, errors,torihikiJissekiMeisaiShuppinSearchAPI }
};