//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAuction } from "@/types/common/MtAuction";

export const useSearchNextLiveAuctionAPI = () => {
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [nextAuction, setNextAuction] = useState<TAuction>();
  useEffect(() => {
    const searchNextLiveAuctionAPI = async () => {
      const { data: responseData } = await apiRequest(
        "member",
        `live/search/nextLiveAuction`,
        "POST",
        null,
        "",
        true
      );
      if (responseData) {
        setNextAuction(responseData);
      }
    };
    searchNextLiveAuctionAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { nextAuction };
};
