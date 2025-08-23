//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TGoodsAuctionBidAdminSearchRequest } from "@/types/admin/goods/bid/search";

export const useBidSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const bidSearchCountAPI = async (searchParams: TGoodsAuctionBidAdminSearchRequest) => {
    const endPoint = "goodsAuctionBid/count";
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

  return { count, bidSearchCountAPI };
};
