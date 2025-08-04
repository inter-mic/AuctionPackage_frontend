//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { KengenGroupSearch } from "@/types/admin/kengen/search";

export const useKengenGroupSearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [kengenGroup, setKengenGroup] = useState<KengenGroupSearch[]>([]);
  useEffect(() => {
    const kengenGroupSearch = async () => {
      const endPoint = `kengenGroup/search`;
      const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
      if (responseData) {
        setKengenGroup(responseData);
      }
    };

    kengenGroupSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { kengenGroup };
};
