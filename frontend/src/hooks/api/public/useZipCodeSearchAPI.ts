//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TZipCodeSelect } from '@/types/common/zipCode/search';



export const useZipCodeSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [address, setAddress] = useState<TZipCodeSelect>();
  const zipCodeSearch = async (zipCode : string) => {

    const endPoint = `zipCode/search/${zipCode}`;
    const { status, data: responseData } = await apiRequest( "public", endPoint, 'POST', null, "", true);
    if (responseData) {
      setAddress(responseData);
    }
  };
  return { address, zipCodeSearch };
};
