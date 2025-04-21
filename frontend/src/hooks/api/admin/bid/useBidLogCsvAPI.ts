//コンフィグ
import { texts } from '@/config/texts';
//API
import { useCsvApiRequest } from '@/hooks/api/useCsvApiRequest';
//コンポーネント
import { getFormattedDate } from '@/components/ui/format/FormatDatetime';



export const useBidLogCsvAPI = () => {  
  const { csvApiRequest } = useCsvApiRequest();
  const bidLogCsv  = async (auctionSeq: string, selectedGoodsIds: number[])=>{
   
    const endPoint = `logInternetBid/csv/${auctionSeq}`;
    await csvApiRequest("admin", endPoint, 'POST', selectedGoodsIds);
  };
  
  return { bidLogCsv };
};