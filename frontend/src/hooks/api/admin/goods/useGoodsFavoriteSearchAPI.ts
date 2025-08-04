//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import {
  TAdminGoodsFavoriteSearchRequest,
  TAdminGoodsFavoriteSelect,
} from "@/types/admin/goods/favoriteSearch";
import { Errors } from "@/types/errors";

export const useGoodsFavoriteSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminGoodsFavoriteSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const goodsFavoriteSearchAPI = async (searchParams: TAdminGoodsFavoriteSearchRequest) => {
    const endPoint = "favorite/search";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );

    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, errors, goodsFavoriteSearchAPI };
};
