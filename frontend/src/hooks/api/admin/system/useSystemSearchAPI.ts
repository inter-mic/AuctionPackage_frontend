//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TSystemSettingSelect } from "@/types/common/systemsetting/search";

export const useSystemSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TSystemSettingSelect>();
  const systemSearch = async () => {
    const endPoint = "system/search";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setData(responseData[0]);
    }
  };

  return { data, systemSearch };
};
