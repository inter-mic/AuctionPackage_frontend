//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { TMtAuctionBidUnit } from "@/types/common/bidUnit";

export const useAuctionBidUnitUpdateAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [updateErrors, setErrors] = useState<Errors>();
  const auctionBidUnitUpdateAPI = async (data: TMtAuctionBidUnit[]) => {
    const endPoint = "auctionBidUnit/update";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      data,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      window.location.reload();
    }
  };
  return { updateErrors, auctionBidUnitUpdateAPI };
};
