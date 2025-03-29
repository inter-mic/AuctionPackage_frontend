//コンフィグ
import { texts } from '@/config/texts';
//API
import { useCsvApiRequest } from '@/hooks/api/useCsvApiRequest';



export const useGoodsCsvForTesuryoAPI = () => {  
  const { csvApiRequest } = useCsvApiRequest();
  const goodsCsvForTesuryo  = async (selectedGoodsIds: number[])=>{
   
    const endPoint = `goods/csvForTesuryo`;
    await csvApiRequest("admin", endPoint, 'POST', selectedGoodsIds);
  };
  
  return { goodsCsvForTesuryo };
};