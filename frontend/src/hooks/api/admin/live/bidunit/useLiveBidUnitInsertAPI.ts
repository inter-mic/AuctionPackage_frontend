//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { TLiveBidUnitRegistRequest } from '@/types/common/bidUnit';




export const useLiveBidUnitInsertAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const liveBidUnitInsertAPI = async (data: TLiveBidUnitRegistRequest ) => {
    const endPoint = 'liveBidUnit/insert'
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', data, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      window.location.reload();
    }
  };
  return { errors, liveBidUnitInsertAPI };
};
