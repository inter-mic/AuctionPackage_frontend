//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Result } from "@/types/admin/member/addinfoItemSearch";

export const useUserAddinfoItemSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const userAddinfoItemSearch = async () => {
    const endPoint = "userAddinfoItem/search";
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

  return { data, userAddinfoItemSearch };
};
