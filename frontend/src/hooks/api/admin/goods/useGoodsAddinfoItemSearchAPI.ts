//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TTtGoodsAddinfoItem } from "@/types/admin/goods/addinfoItemSearch";

export const useGoodsAddinfoItemSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TTtGoodsAddinfoItem[]>([]);
  const goodsAddinfoItemSearch = async () => {
    const endPoint = "goodsAddinfoItem/search";
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

  return { data, goodsAddinfoItemSearch };
};
