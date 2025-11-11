//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { TAuctionBidUnitRegistRequest } from "@/types/common/bidUnit";

export const useAuctionBidUnitInsertAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const auctionBidUnitInsertAPI = async (data: TAuctionBidUnitRegistRequest) => {
    const endPoint = "auctionBidUnit/insert";
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
  return { errors, auctionBidUnitInsertAPI };
};
