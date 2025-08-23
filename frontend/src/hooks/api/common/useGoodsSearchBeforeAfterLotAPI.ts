//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TGoodsBeforeAfterLot } from "@/types/common/goods";

export const useGoodsSearchBeforeAfterLotAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [beforeAfterGoodsId, setBeforeAfterGoodsId] = useState<TGoodsBeforeAfterLot>();
  const goodsSearchBeforeAfterLotAPI = async (
    auctionSeq: number,
    lot: string,
    isLogin: boolean
  ) => {
    const endPointKbn = `${isLogin ? "member" : "public"}`;
    const params = {
      auctionSeq: auctionSeq,
      lot: lot,
    };
    const { status, data: responseData } = await apiRequest(
      endPointKbn,
      "goods/searchBeforeAfterLot",
      "POST",
      params,
      "",
      true
    );

    if (status == 200 && responseData) {
      setBeforeAfterGoodsId(responseData);
    }
  };

  return { beforeAfterGoodsId, goodsSearchBeforeAfterLotAPI };
};
