//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Result } from "@/types/admin/staff/search";

export const useStaffSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const staffSearch = async () => {
    const endPoint = "staff/search/init";
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData);
    }
  };

  return { data, staffSearch };
};
