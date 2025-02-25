//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useLoginCertificationAPI =  (registToken: string | null)  => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string; newPasswordConfirm?: string }>({});
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();
  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent, AdminFlg: boolean) => {
    e.preventDefault();
    const endPoint = `loginCertification/${AdminFlg ? "staff" : "user"}`;
    const requestBody = { oldPassword, newPassword, newPasswordConfirm, registToken};
    const { status, data: responseData } = await apiRequest("public", endPoint, 'POST', requestBody, texts.message.changePassword, true);
    if (status == 400) {
      setErrors(responseData);
    }else if(status == 200){
      const url = `/${AdminFlg ? "admin" : ""}/login`;
      router.push(url);

    }    
  };

  return {
    oldPassword,
    newPassword,
    newPasswordConfirm,
    handleOldPasswordChange,
    handleNewPasswordChange,
    handleNewPasswordConfirmChange,
    handleSubmit,

    errors,
    responseData,
  };
};