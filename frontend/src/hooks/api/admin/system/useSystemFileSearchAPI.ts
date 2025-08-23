//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Result } from "@/types/admin/system/fileSearch";

export const useSystemFileSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [fileData, setData] = useState<Result>();
  const systemFileSearch = async () => {
    const endPoint = "system/search";
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData);
    }
  };

  return { fileData, systemFileSearch };
};
