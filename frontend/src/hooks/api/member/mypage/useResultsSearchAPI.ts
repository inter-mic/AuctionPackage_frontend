//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TResultsSearchRequest, TResultsSelect } from "@/types/member/results";
import { Errors } from "@/types/errors";

export const useResultsSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [resultsList, setResultsList] = useState<TResultsSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const resultsSearchAPI = async (searchParams: TResultsSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "results/search",
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setResultsList(responseData);
    }
  };

  return { resultsList, errors, resultsSearchAPI };
};
