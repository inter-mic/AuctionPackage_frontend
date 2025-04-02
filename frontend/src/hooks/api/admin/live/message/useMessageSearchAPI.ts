//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { TMtLiveMessage } from '@/types/admin/live/message';



export const useMessageSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [message, setMessage] = useState<TMtLiveMessage[]>([]);
  useEffect(() => {
    const messageSearchAPI = async (categorySeq: number) => {

      const endPoint = `liveMessage/search`;
      const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
      if (responseData) {
        setMessage(responseData);
      }
    };

    messageSearchAPI(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { message };
};
