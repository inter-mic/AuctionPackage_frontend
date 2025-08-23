//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TGoodsSelect } from "@/types/common/goods";

export const useGoodsSearchByGoodsIdAPI = () => {
  const { useState, apiRequest } = useCommonSetup();

  const [fetchGoodsData, setFetchGoodsData] = useState<TGoodsSelect>();
  const goodsSearchByGoodsIdAPI = async (goodsId: number, isLogin: boolean) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const { status, data: responseData } = await apiRequest(
      endPointKbn,
      `goods/findGoodsById/${goodsId}`,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setFetchGoodsData(responseData[0]);
    }
  };

  return { fetchGoodsData, goodsSearchByGoodsIdAPI };
};
