//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useUserDeleteAPI = () => {
  const { useState, useEffect, useCallback ,useRouter, texts, apiRequest } = useCommonSetup();
  const router = useRouter();
  const userDelete  = async (UserData: any) => {
    const endPoint = `user/delete/${UserData.userId}` 
    const { status, data: responseData } =await apiRequest("admin", endPoint, 'POST', null, texts.message.delete, false);  
    if (status == 200) {
      router.push('/admin/member/register');
    }
    
  };

  return { userDelete };
};