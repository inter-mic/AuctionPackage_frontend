//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import {
  TAdminTorihikiJissekiRequest,
  TTorihikiJissekiMeisaiRakusatsuSelect,
} from "@/types/admin/torihikiJisseki/search";

export const useTorihikiJissekiMeisaiRakusatsuSearchAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [rakusatsuList, setRakusatsuList] = useState<TTorihikiJissekiMeisaiRakusatsuSelect[]>([]);
  const torihikiJissekiMeisaiRakusatsuSearchAPI = async (
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
      setRakusatsuList(rakusatsuResponseData);
    }
  };

  return { rakusatsuList, torihikiJissekiMeisaiRakusatsuSearchAPI };
};
