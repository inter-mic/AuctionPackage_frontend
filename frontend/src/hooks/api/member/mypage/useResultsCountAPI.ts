//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TResultsSearchRequest } from "@/types/member/results";
import { Errors } from "@/types/errors";

export const useResultsCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [resultsCount, setResultsCount] = useState<number | 0>(0);
  const [errors, setErrors] = useState<Errors>();
  const resultsCountAPI = async (searchParams: TResultsSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "results/count",
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setResultsCount(responseData);
    }
  };

  return { resultsCount, errors, resultsCountAPI };
};
