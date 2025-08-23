//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import {
  TAdminTorihikiJissekiRequest,
  TVTorihikiJisseki,
} from "@/types/admin/torihikiJisseki/search";
import { Errors } from "@/types/errors";

export const useTorihikiJissekiSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [torihikiList, setTorihikiList] = useState<TVTorihikiJisseki[]>([]);
  const [errors, setErrors] = useState<Errors>();
  const torihikiJissekiSearchAPI = async (searchParams: TAdminTorihikiJissekiRequest) => {
    const { status, data: responseData } = await apiRequest(
      "admin",
      "torihikiJisseki/search",
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200 && responseData) {
      setTorihikiList(responseData);
    }
  };

  return { torihikiList, errors, torihikiJissekiSearchAPI };
};
