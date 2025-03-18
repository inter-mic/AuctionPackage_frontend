//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';
import { Contact, initialContact} from '@/types/public/contact';


export const useContactSendAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [status, setStatus] = useState<number | null>(null); 
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();
  const contactSendAPI = async (Contact: Contact, sendFlg: boolean, isLogin:boolean) => {
    const endPoint = `contact/${sendFlg ? "send" : "sendConfirm"}`;
    const { status, data: responseData } = await apiRequest("public", endPoint, 'POST', Contact, "", true);
    setStatus(status);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      if (sendFlg) {
        if(isLogin){
          router.push('./member/contactCompletion'); 
        }else{
          router.push('./contactCompletion'); 
        }
        
      }
      
    }
  };
  return {  errors, contactSendAPI };
};
