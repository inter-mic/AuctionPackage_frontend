//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TSystemSettingSelect } from "@/types/common/systemsetting/search";

export const useSystemSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [fetchSystemSettingData, setFetchSystemSettingData] = useState<TSystemSettingSelect>();
  const systemSearchAPI = async () => {
    const endPoint = "system/search";
    const { status, data: responseData } = await apiRequest(
      "member",
      endPoint,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setFetchSystemSettingData(responseData[0]);
    }
  };

  return { fetchSystemSettingData, systemSearchAPI };
};
