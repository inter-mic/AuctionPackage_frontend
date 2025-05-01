import { useState } from 'react';
//型定義
import { TAdminPaddleSearchRequest } from '@/types/admin/paddle/management';



export const usePaddleSearchParams = () => {
  const [paddleParams, setPaddleParams] = useState<TAdminPaddleSearchRequest>({
      userId: '',
      userName: '',
      auctionSeq: '',
      paddleKbn: '',
      paddleNo: '',
      pageNumber:1,
      pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
    });

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaddleParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };

  const resetForm = () => {
    setPaddleParams({
      userId: '',
      userName: '',
      auctionSeq: '',
      paddleKbn: '',
      paddleNo: '',
      pageNumber:1,
       pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
    });
  };
  
  return { paddleParams, formChange, resetForm };
};
  