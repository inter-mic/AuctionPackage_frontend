//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TMarketSearchRequest, TMarketSelect } from "@/types/member/market";
import { Errors } from "@/types/errors";

export const useMarketSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [marketList, setMarketList] = useState<TMarketSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const marketSearchAPI = async (searchParams: TMarketSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "market/search",
      "POST",
      searchParams,
      "",
      true,
      {},
      true
    );

    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setMarketList(responseData);
    }
  };

  return { marketList, errors, marketSearchAPI };
};
