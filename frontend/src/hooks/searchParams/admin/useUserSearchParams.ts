import { useState } from 'react';
//型定義
import { SearchParams } from '@/types/admin/member/search'; 



export const useUserSearchParams = () => {
  const [memberParams, setMemberParams] = useState<SearchParams>({
      userId: '',
      userName: '',
      companyName: '',
      shoninFlg: '',
      freeWord: '',
    });

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMemberParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };

  const resetForm = () => {
    setMemberParams({
      userId: '',
      userName: '',
      companyName: '',
      shoninFlg: '',
      freeWord: '',
    });
  };
  
  return { memberParams, formChange,resetForm };
};
  