//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TYearMonthSelect } from "@/types/public/yearMonth";

export const useYearMonthSearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [yearMonth, setYearMonth] = useState<TYearMonthSelect[]>([]);
  useEffect(() => {
    const yearMonthSearchAPI = async () => {
      const endPoint = `yearMonth/search`;
      const { data: responseData } = await apiRequest("public", endPoint, "POST", null, "", true);
      if (responseData) {
        setYearMonth(responseData);
      }
    };

    yearMonthSearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { yearMonth };
};
