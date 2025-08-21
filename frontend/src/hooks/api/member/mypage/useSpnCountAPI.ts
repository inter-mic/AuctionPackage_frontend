//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

//型定義
import { TSpnSearchRequest } from "@/types/member/spn";
import { Errors } from "@/types/errors";

export const useSpnCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [spnCount, setSpnCount] = useState<number | 0>(0);
  const [errors, setErrors] = useState<Errors>();
  const spnCountAPI = async (searchParams: TSpnSearchRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "spn/count",
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setSpnCount(responseData);
    }
  };

  return { spnCount, errors, spnCountAPI };
};
