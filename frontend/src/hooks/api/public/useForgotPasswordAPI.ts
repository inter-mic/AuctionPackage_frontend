//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useForgotPasswordAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [mail, setMail] = useState('');
  const [errors, setErrors] = useState<{ mail?: string }>({});
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();
  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail(e.target.value);
  };
  const handleInputFocus = () => {
    setErrors((prevErrors) => ({ ...prevErrors, mail: undefined }));
  };
  const handleSubmit = async (e: React.FormEvent, AdminFlg: boolean) => {
    e.preventDefault();
    const endPoint = `forgotPassword/${AdminFlg ? "staff" : "user"}`;
    const requestBody = { mail };
    const { status, data: responseData } = await apiRequest("public", endPoint, 'POST', requestBody, texts.message.forgotPassword, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
     
    }
  };

  return {
    mail,
    handleMailChange,
    handleSubmit,
    handleInputFocus,
    errors,
    responseData,
  };
};