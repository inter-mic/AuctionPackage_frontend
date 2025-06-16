//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useLiveApplicationAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [fetchPaddleNo, setFetchPaddleNo] = useState<string>("");
  const liveApplicationAPI = async (auctionSeq: number) => {
    const { data: responseData } = await apiRequest(
      "member",
      `liveApplication/insert/${auctionSeq}`,
      "POST",
      null,
      "",
      true
    );
    if (responseData) {
      setFetchPaddleNo(responseData);
    }
  };

  return { fetchPaddleNo, liveApplicationAPI };
};
