import {useCommonSetup} from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';




export const useMailTemplateRegistAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const mailTemplateRegistAPI = async (templateId: any, mailTemplates: any)=>{
    const endPoint = `mailTemplate/update/${templateId}`;
    const { status, data: responseData } = await apiRequest("admin", endPoint, 'POST', mailTemplates, texts.message.regist, false);
    if (status == 400) {
      setErrors(responseData);
    }else if (status == 500) {
      setErrors(responseData);
    }
  };
  return { mailTemplateRegistAPI };
};
  
export default useMailTemplateRegistAPI;