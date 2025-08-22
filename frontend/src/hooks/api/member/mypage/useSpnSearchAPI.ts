//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TSpnSearchRequest, TSpnSelect } from "@/types/member/shuppin";
import { Errors } from "@/types/errors";

export const useSpnSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [resultsList, setResultsList] = useState<TSpnSelect[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const spnSearchAPI = async (searchParams: TSpnSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "spn/search",
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

  return { resultsList, errors, spnSearchAPI };
};
