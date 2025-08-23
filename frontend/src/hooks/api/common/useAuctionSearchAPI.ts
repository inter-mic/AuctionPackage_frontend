//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAuction } from "@/types/common/MtAuction";

export const useAuctionSearchAPI = (kaisaiStatus: number, isLogin: boolean) => {
  const endPointKbn = `${isLogin ? "member" : "public"}`;
  const { useState, useEffect, apiRequest } = useCommonSetup();
  const [auction, setAuction] = useState<TAuction[]>([]);
  useEffect(() => {
    const auctionSearch = async () => {
      let endPoint = "";
      if (kaisaiStatus == 1) {
        endPoint = `auction/kaisaiBidStartList`;
      }
      const { data: responseData } = await apiRequest(
        endPointKbn,
        endPoint,
        "POST",
        null,
        "",
        true
      );
      if (responseData) {
        setAuction(responseData);
      }
    };

    auctionSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kaisaiStatus]);

  return { auction };
};
