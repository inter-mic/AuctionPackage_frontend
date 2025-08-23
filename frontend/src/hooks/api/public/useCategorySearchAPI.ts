//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TCategorySearch } from "@/types/common/category/search";

export const useCategorySearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [category, setCategory] = useState<TCategorySearch[]>([]);
  useEffect(() => {
    const categorySearchAPI = async () => {
      const endPoint = `category/search`;
      const { data: responseData } = await apiRequest("public", endPoint, "POST", null, "", true);
      if (responseData) {
        setCategory(responseData);
      }
    };

    categorySearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { category };
};
