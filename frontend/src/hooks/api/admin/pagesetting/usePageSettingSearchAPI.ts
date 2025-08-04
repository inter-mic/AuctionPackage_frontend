//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TTtPageSetting } from "@/types/admin/pagesetting/search";

export const usePageSettingSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TTtPageSetting[]>([]);
  const pageSettingSearchAPI = async () => {
    const endPoint = "pageSetting/search";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, pageSettingSearchAPI };
};
