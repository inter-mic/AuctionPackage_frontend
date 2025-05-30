//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { TMtLiveBidUnit } from '@/types/common/bidUnit';




export const useLiveBidUnitUpdateAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [updateErrors, setErrors] = useState<Errors>();
  const liveBidUnitUpdateAPI = async (data: TMtLiveBidUnit[] ) => {
    const endPoint = 'liveBidUnit/update'
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', data, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      window.location.reload();
    }
  };
  return { updateErrors, liveBidUnitUpdateAPI };
};
