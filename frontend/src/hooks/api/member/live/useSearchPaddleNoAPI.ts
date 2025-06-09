//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useSearchPaddleNoAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [fetchPaddleNo, setFetchPaddleNo] = useState<string>("");
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
    }
  };

  return { fetchPaddleNo, searchPaddleNoAPI };
};
