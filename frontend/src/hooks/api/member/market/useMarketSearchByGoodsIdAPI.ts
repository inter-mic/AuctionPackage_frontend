//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TMarketSelect } from "@/types/member/market";

export const useMarketSearchByGoodsIdAPI = () => {
  const { useState, apiRequest } = useCommonSetup();

  const [fetchGoodsData, setFetchGoodsData] = useState<TMarketSelect>();
  const marketSearchByGoodsIdAPI = async (goodsId: number) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      `market/findGoodsById/${goodsId}`,
      "POST",
      null,
      "",
      true
    );
    if (status == 200 && responseData) {
      setFetchGoodsData(responseData[0]);
    }
  };

  return { fetchGoodsData, marketSearchByGoodsIdAPI };
};
