//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminTorihikiJissekiRequest } from "@/types/admin/torihikiJisseki/search";

export const useTorihikiJissekiMeisaiRakusatsuSearchCountAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [count, setCount] = useState<number | 0>(0);
  const torihikiJissekiMeisaiRakusatsuSearchCountAPI = async (
    searchParams: TAdminTorihikiJissekiRequest
  ) => {
    const { data: rakusatsuResponseData } = await apiRequest(
      "admin",
      `torihikiJissekiMeisai/rakusatsu`,
      "POST",
      searchParams,
      "",
      true
    );
    if (rakusatsuResponseData) {
      setCount(rakusatsuResponseData);
    }
  };

  return { count, torihikiJissekiMeisaiRakusatsuSearchCountAPI };
};
