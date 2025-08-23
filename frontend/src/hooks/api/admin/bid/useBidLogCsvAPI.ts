//コンフィグ
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";
//コンポーネント

export const useBidLogCsvAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const bidLogCsv = async (auctionSeq: string, selectedGoodsIds: number[]) => {
    const endPoint = `logInternetBid/csv/${auctionSeq}`;
    await csvApiRequest("admin", endPoint, "POST", selectedGoodsIds);
  };

  return { bidLogCsv };
};
