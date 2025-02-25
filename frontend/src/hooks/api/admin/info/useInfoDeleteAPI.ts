//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useInfoDeleteAPI = () => {
  const { useState, useEffect, useCallback ,useRouter, texts, apiRequest } = useCommonSetup();
  const infoDelete  = async (fetchedData: any) => {
    const endPoint = `MtInfo/delete/${fetchedData.infoSeq}` 
    const { status, data: responseData } =await apiRequest("admin", endPoint, 'POST', null, texts.message.delete, false);  
    if (status == 200) {
      //window.location.reload();
    }
    
  };
  

  return { infoDelete };
};