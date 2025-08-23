//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useSearchPaddleNoAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [fetchPaddleNo, setFetchPaddleNo] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<number>();
  const searchPaddleNoAPI = async (auctionSeq: number) => {
    const { data: responseData } = await apiRequest(
      "member",
      `live/search/paddleNo/${auctionSeq}`,
      "POST",
      null,
      "",
      true
    );
    if (responseData) {
      setFetchPaddleNo(responseData);
      setResponseStatus(responseStatus);
    }
  };

  return { responseStatus, fetchPaddleNo, searchPaddleNoAPI };
};
