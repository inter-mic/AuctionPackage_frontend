//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



export const useChangePasswordAPI =  ()  => {
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
  const handleInputFocus =  (field: 'oldPassword' |'newPassword' | 'newPasswordConfirm') => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endPoint = `user/changePassword`;
    const requestBody = { oldPassword, newPassword, newPasswordConfirm};
    const { status, data: responseData } = await apiRequest("member", endPoint, 'POST', requestBody, texts.message.changePassword, true);
    if (status == 400) {
      setErrors(responseData);
    }else if(status == 200){
      setResponseData(responseData);

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
    handleInputFocus,
    errors,
    responseData,
  };
};