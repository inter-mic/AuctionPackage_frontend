//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";

export const useTorihikiJissekiCsvAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const torihikiJissekiCsv = async (
    auctionSeq: number,
    selectedUserIds: number[],
    csvKbn: number
  ) => {
    const baseEndpoint =
      csvKbn === 1 ? "torihikiJisseki/torihikiJissekicsv" : "torihikiJisseki/meisaicsv";
    const endPoint = `${baseEndpoint}/${auctionSeq}`;

    await csvApiRequest("admin", endPoint, "POST", selectedUserIds);
  };

  return { torihikiJissekiCsv };
};
