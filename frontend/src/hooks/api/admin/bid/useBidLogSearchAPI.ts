//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TLogBidAdminSearchRequest, TAdminLogBidSelect } from "@/types/admin/bid/logSearch";
import { Errors } from "@/types/errors";

export const useBidLogSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminLogBidSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const bidLogSearchAPI = async (searchParams: TLogBidAdminSearchRequest) => {
    const endPoint = "logBid/search";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      searchParams,
      "",
      true
    );

    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setData(responseData);
    }
  };

  return { data, errors, bidLogSearchAPI };
};
