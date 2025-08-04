//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminTorihikiJissekiRequest } from "@/types/admin/torihikiJisseki/search";

export const useTorihikiJissekiSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const torihikiJissekiSearchCountAPI = async (searchParams: TAdminTorihikiJissekiRequest) => {
    const { status, data: responseData } = await apiRequest(
      "member",
      "torihikiJisseki/count",
      "POST",
      searchParams,
      "",
      true
    );
    if (status == 200 && responseData) {
      setCount(responseData);
    }
  };

  return { count, torihikiJissekiSearchCountAPI };
};
