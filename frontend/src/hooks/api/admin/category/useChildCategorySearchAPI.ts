//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TCategorySearch } from "@/types/common/category/search";

export const useChildCategorySearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [childCategory, setChildCategory] = useState<TCategorySearch[]>([]);

  const childCategorySearchAPI = async (categorySeq: number) => {
    const endPoint = `category/search/child/${categorySeq}`;
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setChildCategory(responseData);
    }
  };
  return { childCategory, childCategorySearchAPI };
};
