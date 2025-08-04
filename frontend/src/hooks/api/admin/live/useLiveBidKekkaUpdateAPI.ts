//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { LiveBidKekkaData } from "@/types/admin/live/register";
import { TLiveBidLog } from "@/types/admin/live/auctioneer";

export const useLiveBidKekkaUpdateAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [liveBidKekkaRegistErrors, setLiveBidKekkaRegistErrors] = useState<string | undefined>();
  const [responseData, setResponseData] = useState<LiveBidKekkaData>();
  const liveBidKekkaUpdateAPI = async (
    auctionKekkaStatus: number | null,
    liveBidKekka: LiveBidKekkaData,
    liveBidLog: TLiveBidLog[],
    connectionCount: number | null | undefined
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    const sanitizedKekkaData = {
      ...liveBidKekka,
      auctionKekkaStatus: auctionKekkaStatus,
      rakusatsuPrice: liveBidKekka.rakusatsuPrice
        ? liveBidKekka.rakusatsuPrice.replace(/,/g, "")
        : null,
      connectionCount: connectionCount == null ? "0" : connectionCount.toString(),
    };

    const formData = new FormData();
    if (liveBidLog != null) {
      liveBidLog.forEach((row) => {
        formData.append("liveBidUserIdList", row.userId);
        formData.append("liveBidPriceList", row.bidPrice);
        formData.append("liveBidTimeList", row.bidTime);
        formData.append("liveBidKbnList", row.bidKbn);
        formData.append("liveBidPaddleNoList", row.paddleNo);
      });
    }

    formData.append(
      "liveBidKekkaData",
      new Blob([JSON.stringify(sanitizedKekkaData)], { type: "application/json" })
    );

    const { status, data: responseData } = await apiRequest(
      "admin",
      `liveBid/kekkaUpdate/${liveBidKekka.goodsId}`,
      "POST",
      formData,
      texts.message.regist,
      true,
      {},
      false
    );
    if (status === 200) {
      setResponseData(responseData);
      return { success: true };
    } else {
      let errorMessage = "";
      if (responseData && typeof responseData === "object") {
        const values = Object.values(responseData);
        if (values.length > 0) {
          errorMessage = String(values[0]);
        }
      } else if (typeof responseData === "string") {
        errorMessage = responseData;
      }
      setLiveBidKekkaRegistErrors(errorMessage);
      return { success: false, errorMessage };
    }
  };
  return { responseData, liveBidKekkaRegistErrors, liveBidKekkaUpdateAPI };
};
