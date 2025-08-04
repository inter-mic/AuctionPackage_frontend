//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminGoodsSearchRequest, TAdminGoodsSelect } from "@/types/admin/goods/search";
import {
  GoodsData,
  initialGoodsData,
  GoodsKekkaData,
  initialGoodsKekkaData,
} from "@/types/admin/goods/register";
import { Errors } from "@/types/errors";

export const useGoodsSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminGoodsSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const [fetchGoodsData, setFetchGoodsData] = useState<GoodsData>(initialGoodsData);
  const [fetchGoodsKekkaData, setFetchGoodsKekkaData] =
    useState<GoodsKekkaData>(initialGoodsKekkaData);
  const goodsSearchAPI = async (searchParams: TAdminGoodsSearchRequest) => {
    const endPoint = "goods/search";
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
      setFetchGoodsData(responseData);
      setFetchGoodsKekkaData(responseData);
    }
  };

  return { data, fetchGoodsData, fetchGoodsKekkaData, errors, goodsSearchAPI };
};
