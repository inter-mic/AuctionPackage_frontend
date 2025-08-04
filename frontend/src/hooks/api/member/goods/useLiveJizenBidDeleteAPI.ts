//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";

export const useLiveJizenBidDeleteAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [liveJizenBidErrors, setLiveJizenBidErrors] = useState<Errors>();
  const [liveJizenBidResponseStatus, setLiveJizenBidResponseStatus] = useState<number>();
  const liveJizenBidDeleteAPI = async (goodsId: number) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      `jizenBid/delete/${goodsId}`,
      "POST",
      null,
      texts.message.delete,
      true
    );
    if (status == 400) {
      setLiveJizenBidErrors(responseData);
    }
    setLiveJizenBidResponseStatus(status);
    if (status === 200) {
      setTimeout(() => setLiveJizenBidResponseStatus(undefined), 100);
    }
  };

  return { liveJizenBidResponseStatus, liveJizenBidErrors, liveJizenBidDeleteAPI };
};
