//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { infoData } from "@/types/admin/info/register";
export const useInfoGetInfoAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<infoData>();
  const infoGetInfo = async (infoSeq: number) => {
    const endPoint = `MtInfo/search/${infoSeq}`;
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData[0]);
    }
  };

  return { data, infoGetInfo };
};
