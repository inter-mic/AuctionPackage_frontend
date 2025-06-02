//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { TAuction } from "@/types/common/MtAuction";
export const useCheckLiveAuctionAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [fetchAuction, setFetchAuction] = useState<TAuction>();
  useEffect(() => {
    const checkLiveAuctionAPI = async () => {
      const { data: responseData } = await apiRequest(
        "member",
        `live/checkLiveAuction`,
        "POST",
        null,
        "",
        true
      );
      if (responseData) {
        setFetchAuction(responseData);
      }
    };
    checkLiveAuctionAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fetchAuction };
};
