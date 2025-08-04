//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TMtRate } from "@/types/common/rate/search";

export const useRateSearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [rate, setRate] = useState<TMtRate[]>([]);
  useEffect(() => {
    const rateSearch = async () => {
      const endPoint = `rate/search`;
      const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
      if (responseData) {
        setRate(responseData);
      }
    };

    rateSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { rate };
};
