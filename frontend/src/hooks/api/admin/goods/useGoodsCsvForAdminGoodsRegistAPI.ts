//コンフィグ
import { getTexts } from "@/config/texts";
//API
import { useCsvApiRequest } from "@/hooks/api/useCsvApiRequest";

export const useGoodsCsvForAdminGoodsRegistAPI = () => {
  const { csvApiRequest } = useCsvApiRequest();
  const goodsCsvForAdminGoodsRegist = async (selectedGoodsIds: number[]) => {
    const endPoint = `goods/csvForAdminGoodsRegist`;
    await csvApiRequest("admin", endPoint, "POST", selectedGoodsIds);
  };

  return { goodsCsvForAdminGoodsRegist };
};
