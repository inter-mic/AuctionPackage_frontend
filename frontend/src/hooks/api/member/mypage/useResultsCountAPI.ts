//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TResultsSearchRequest } from "@/types/member/results";
import { Errors } from "@/types/errors";

export const useResultsCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [resultsCount, setResultsCount] = useState<number | 0>(0);
  const [errors, setErrors] = useState<Errors>();
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * API member/results/search
   * @param searchParams - search query
/*******  708811f7-9d41-4272-83ff-07816e2bec7e  *******/
  const resultsCountAPI = async (searchParams: TResultsSearchRequest) => {
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
      setResultsCount(responseData);
    }
  };

  return { resultsCount, errors, resultsCountAPI };
};
