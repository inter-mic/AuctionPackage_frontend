//コンフィグ
import { texts } from '@/config/texts';
//API
import { useCsvApiRequest } from '@/hooks/api/useCsvApiRequest';



export const useGoodsCsvForAdminGoodsRegistAPI = () => {  
  const { csvApiRequest } = useCsvApiRequest();
  const goodsCsvForAdminGoodsRegist  = async (selectedUserIds: number[])=>{
   
    const endPoint = `goods/csvForAdminGoodsRegist`;
    await csvApiRequest("admin", endPoint, 'POST', selectedUserIds);
  };
  
  return { goodsCsvForAdminGoodsRegist };
};