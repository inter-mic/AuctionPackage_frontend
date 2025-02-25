//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useGoodsDeleteAPI = () => {
  const { useState, useEffect, useCallback ,useRouter, texts, apiRequest } = useCommonSetup();
  const goodsDeleteAPI  = async (goodsId: number) => {
    const endPoint = `goods/delete/${goodsId}` 
    const { status, data: responseData } =await apiRequest("admin", endPoint, 'POST', null, texts.message.delete, false);  
    if (status == 200) {
      window.location.reload();
    }
    
  };
  

  return { goodsDeleteAPI };
};