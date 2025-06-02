//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { dataURLtoFile, urlToFile } from "@/components/ui/images/fileUtils";
//型定義
import { Errors } from "@/types/errors";
import { LiveBidKekkaData } from "@/types/admin/live/register";
import { TLiveBidLog } from "@/types/admin/live/auctioneer";

export const useLiveBidKekkaUpdateAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [liveBidKekkaRegistErrors, setLiveBidKekkaRegistErrors] = useState<Errors>();
  const [responseData, setResponseData] = useState<LiveBidKekkaData>();
  const router = useRouter();
  const liveBidKekkaUpdateAPI = async (
    liveBidKekka: LiveBidKekkaData,
    liveBidLog: TLiveBidLog[],
    connectionCount: number | null | undefined,
    spnKbn: string | string[] | undefined
  ) => {
    const sanitizedKekkaData = {
      ...liveBidKekka,
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
      true
    );
    if (status === 400) {
      setLiveBidKekkaRegistErrors(responseData);
      return false; // エラーが発生したので false を返す
    } else {
      setResponseData(responseData);
      return true; // 成功したので true を返す
    }
  };
  return { responseData, liveBidKekkaRegistErrors, liveBidKekkaUpdateAPI };
};
