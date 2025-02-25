//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useReissuePasswordAPI = (registToken: string | null) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; newPasswordConfirm?: string }>({});
  const [responseData, setResponseData] = useState(null);
  const router = useRouter();
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordConfirm(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent, AdminFlg: boolean) => {
    e.preventDefault();
    const endPoint = `reissuePassword/${AdminFlg ? "staff" : "user"}/registPassword`;
    const requestBody = { newPassword, newPasswordConfirm, registToken };
    const { status, data: responseData } = await apiRequest("public", endPoint, 'POST', requestBody, texts.message.forgotPassword, true);
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setResponseData(responseData);
      const url = `/${AdminFlg ? "admin" : "member"}/login`;
      router.push(url);
    }
  };
  const ReissuePasswordAPI = async (AdminFlg: boolean) => {

  };

  return {
    newPassword,
    newPasswordConfirm,
    handleNewPasswordChange,
    handleNewPasswordConfirmChange,
    handleSubmit,
    errors,
    responseData,
  };
};