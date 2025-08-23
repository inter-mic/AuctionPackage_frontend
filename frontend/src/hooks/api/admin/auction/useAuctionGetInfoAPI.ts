//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { TAdminAuctionRegistRequest } from "@/types/admin/auction/register";
export const useAuctionGetInfoAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState<TAdminAuctionRegistRequest>();
  const auctionGetInfo = async (auctionSeq: number) => {
    const endPoint = `auction/search/${auctionSeq}`;
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData[0]);
    }
  };

  return { data, auctionGetInfo };
};
