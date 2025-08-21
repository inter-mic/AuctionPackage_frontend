//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TGoodsAuctionBidAdminSearchRequest } from "@/types/admin/goods/bid/search";

export const useBidLogSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const bidLogSearchCountAPI = async (searchParams: TGoodsAuctionBidAdminSearchRequest) => {
    const endPoint = "logBid/count";
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

  return { count, bidLogSearchCountAPI };
};
