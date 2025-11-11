//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TMtAuctionBidUnit } from "@/types/common/bidUnit";

export const useAuctionBidUnitSearchAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [auctionBidUnitList, setAuctionBidUnitList] = useState<TMtAuctionBidUnit[]>([]);
  useEffect(() => {
    const auctionBidUnitSearchAPI = async () => {
      const endPoint = `auctionBidUnit/search`;
      const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
      if (responseData) {
        setAuctionBidUnitList(responseData);
      }
    };

    auctionBidUnitSearchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { auctionBidUnitList };
};
