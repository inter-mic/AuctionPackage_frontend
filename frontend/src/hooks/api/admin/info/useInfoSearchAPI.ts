//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { InfoSearch } from '@/types/admin/info/search';



export const useInfoSearchAPI = () => {
  const { useState,useEffect,useCallback ,useRouter,texts,  apiRequest } = useCommonSetup();
  const [info, setInfo] = useState<InfoSearch[]>([]);
  useEffect(() => {
    const infoSearch = async (infoSeq: number) => {

      const endPoint = `MtInfo/search/${infoSeq}`;
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        setInfo(responseData);
      }
    };

    infoSearch(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { info };
};