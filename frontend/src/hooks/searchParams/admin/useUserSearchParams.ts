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
      pageNumber:1,
      pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
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
      pageNumber:1,
       pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
    });
  };
  
  return { memberParams, formChange,resetForm };
};
  