import {useCommonSetup} from '@/hooks/useCommonSetup';



export const usePrivacyPolicyDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const privacyPolicyDeleteAPI  = async (systemSeq: any)=>{
    const endPoint = `system/privacyPolicy/delete/${systemSeq}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', null, texts.message.regist, false);
    if (status == 200) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  return { privacyPolicyDeleteAPI };
};
  
export default usePrivacyPolicyDeleteAPI;