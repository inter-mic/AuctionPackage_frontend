//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Result } from "@/types/admin/kengen/search";
import { Errors } from "@/types/errors";

export const useKengenListSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<Result[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const kengenListSearch = async (kengenId: string | null) => {
    const endPoint = `kengenList/search/${kengenId}`;
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      "",
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 500) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setData(responseData);
    }
  };
  return { data, errors, kengenListSearch };
};
