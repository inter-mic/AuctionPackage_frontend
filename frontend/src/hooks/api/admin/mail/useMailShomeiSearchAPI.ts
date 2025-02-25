//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { ShomeiResult } from '@/types/admin/mail/search';



export const useMailShomeiSearchAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [shomeiData, setData] = useState<ShomeiResult>();
  const mailShomeiSearch = async () => {
    const endPoint = 'mailShomei/search';
    const { status, data: responseData } = await apiRequest( "admin", endPoint, 'POST', null, "", true);
    if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { shomeiData, mailShomeiSearch }
};
