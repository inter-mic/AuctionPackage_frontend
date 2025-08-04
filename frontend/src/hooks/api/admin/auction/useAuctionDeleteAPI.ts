//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useAuctionDeleteAPI = () => {
  const { texts, apiRequest } = useCommonSetup();
  const auctionDelete = async (fetchedData: any) => {
    const endPoint = `auction/delete/${fetchedData.auctionSeq}`;
    const { status } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      null,
      texts.message.delete,
      false
    );
    if (status == 200) {
      window.location.reload();
    }
  };

  return { auctionDelete };
};
