//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";
//コンポーネント
import { getFormattedDate } from "@/components/ui/format/FormatDatetime";

interface Request {
  goodsId: number;
  userId: number;
}

export const useBidCsvAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const bidCsv = async (selectedGoodsIds: string[]) => {
    const requestData: Request[] = selectedGoodsIds.map((item) => {
      const [goodsId, userId] = item.split("-").map(Number);
      return { goodsId, userId };
    });

    const endPoint = `goodsAuctionBid/csv`;
    await csvApiRequest("admin", endPoint, "POST", requestData);
  };

  return { bidCsv };
};
