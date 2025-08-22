//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TMarketSearchRequest } from "@/types/member/market";
import { Errors } from "@/types/errors";

export const useMarketCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [marketCount, setMarketCount] = useState<number | 0>(0);
  const [errors, setErrors] = useState<Errors>();
  const marketCountAPI = async (searchParams: TMarketSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "goods/count",
      "POST",
      searchParams,
      "",
      true,
      {},
      false
    );

    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setMarketCount(responseData);
    }
  };

  return { marketCount, errors, marketCountAPI };
};
