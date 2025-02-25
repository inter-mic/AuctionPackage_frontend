//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { SystemData } from '@/types/admin/system/register';



export const useFaviconImageRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [faviconErrors, setErrors] = useState<Errors>();
  const [faviconResponseData, setResponseData] = useState(null);
  const faviconRegist = async (systemData: SystemData, file: File | null) => {
    
    const systemSeq = systemData.systemSeq || '';
    const endPoint = `system/faviconImage/update/${systemSeq}`;
    const formData = new FormData();
    if (file) {
      formData.append('files', file);
    }
    
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', formData, texts.message.regist, true);
    if (status == 400) {
      setErrors(responseData);
    }else if(status == 200){
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }   
  };
  
  return { faviconResponseData, faviconErrors, faviconRegist };
};