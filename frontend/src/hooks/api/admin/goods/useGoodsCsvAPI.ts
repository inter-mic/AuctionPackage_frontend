//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";

export const useGoodsCsvAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const goodsCsv = async (selectedGoodsIds: number[]) => {
    const endPoint = `goods/csv`;
    await csvApiRequest("admin", endPoint, "POST", selectedGoodsIds);
  };

  return { goodsCsv };
};
