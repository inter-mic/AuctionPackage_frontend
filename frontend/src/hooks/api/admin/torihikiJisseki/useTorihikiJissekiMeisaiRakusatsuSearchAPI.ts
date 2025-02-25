//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TAdminTorihikiJissekiRequest, TTorihikiJissekiMeisaiRakusatsuSelect } from '@/types/admin/torihikiJisseki/search';
import { Errors } from '@/types/errors';


export const useTorihikiJissekiMeisaiRakusatsuSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [rakusatsuList, setRakusatsuList] = useState<TTorihikiJissekiMeisaiRakusatsuSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const torihikiJissekiMeisaiRakusatsuSearchAPI = async (searchParams: TAdminTorihikiJissekiRequest) => {

    const { data: rakusatsuResponseData } = await apiRequest("admin", `torihikiJissekiMeisai/rakusatsu`, 'POST', searchParams, "", true);
    if(rakusatsuResponseData){
      setRakusatsuList(rakusatsuResponseData);   
    }
   
  };

  return { rakusatsuList, errors,torihikiJissekiMeisaiRakusatsuSearchAPI }
};