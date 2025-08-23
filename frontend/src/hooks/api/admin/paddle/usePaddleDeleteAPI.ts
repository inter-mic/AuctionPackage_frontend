//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const usePaddleDeleteAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [responseStatus, setResponseStatus] = useState<number>();
  const paddleDeleteAPI = async (auctionSeq: string, userId: string) => {
    const endPoint = `paddle/delete/${auctionSeq}/${userId}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.delete,
      true
    );
    setResponseStatus(status);
  };
  return { responseStatus, paddleDeleteAPI };
};
