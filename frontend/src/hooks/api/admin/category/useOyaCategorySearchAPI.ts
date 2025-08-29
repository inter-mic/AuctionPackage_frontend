//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TCategorySearch } from "@/types/common/category/search";

export const useOyaCategorySearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [oyaCategory, setOyaCategory] = useState<TCategorySearch[]>([]);
  useEffect(() => {
    const categoryOyaSearch = async () => {
      const endPoint = `category/search/oya`;
      const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
      if (responseData) {
        setOyaCategory(responseData);
      }
    };

    categoryOyaSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { oyaCategory };
};
