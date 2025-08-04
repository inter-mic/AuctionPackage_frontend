//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import {
  TGoodsAuctionBidAdminSearchRequest,
  TAdminGoodsAuctionBidSelect,
} from "@/types/admin/bid/search";
import { Errors } from "@/types/errors";

export const useBidSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminGoodsAuctionBidSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const bidSearchAPI = async (searchParams: TGoodsAuctionBidAdminSearchRequest) => {
    const endPoint = "goodsAuctionBid/search";
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

  return { data, errors, bidSearchAPI };
};
