//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminGoodsSearchRequest } from "@/types/admin/goods/search";
export const useGoodsSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const goodsSearchCountAPI = async (searchParams: TAdminGoodsSearchRequest) => {
    const endPoint = "goods/count";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 200 && responseData) {
      setCount(responseData);
    }
  };

  return { count, goodsSearchCountAPI };
};
