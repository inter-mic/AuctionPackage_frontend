//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//型定義
import { Errors } from '@/types/errors';



export const useStaffDeleteAPI = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const staffDelete  = async (StaffData: any) => {
    const endPoint = `staff/delete/${StaffData.staffId}` 
    const { status, data: responseData } =await apiRequest("admin", endPoint, 'POST', null, texts.message.delete, false);  

    if (status == 400) {
      setErrors(responseData);
    }else if(status == 200){
      setTimeout(() => {
        window.location.href = `/admin/staff/register`;
      }, 1500);
    }   
  };

  return { staffDelete };
};
