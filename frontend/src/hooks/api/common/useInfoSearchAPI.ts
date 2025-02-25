//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

//型定義
import { Info } from '@/types/common/info';



export const useInfoSearchAPI = (isLogin: boolean) => {
  const { useState, useEffect, texts, apiRequest } = useCommonSetup();
  const [info, setInfo] = useState<Info[]>([]);
  useEffect(() => {
    const fetchInfo = async () => {
      const endPointKbn = `${isLogin ? "member" : "public"}`;
      const { status, data: responseData } = await apiRequest(endPointKbn, "MtInfo/search", 'POST', null, "", true);
      if (status === 200) {
        setInfo(responseData);
      }
    };
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { info };
};