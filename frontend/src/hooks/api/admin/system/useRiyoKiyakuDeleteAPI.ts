import {useCommonSetup} from '@/hooks/useCommonSetup';



export const useRiyoKiyakuDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const riyoKiyakuDeleteAPI  = async (systemSeq: any)=>{
    const endPoint = `system/kiyaku/delete/${systemSeq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, texts.message.regist, false);
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { riyoKiyakuDeleteAPI };
};
  
export default useRiyoKiyakuDeleteAPI;