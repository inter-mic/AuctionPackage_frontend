import { useState } from 'react';
//型定義
import { TResultsSearchRequest } from '@/types/member/results';

export const useResultsSearchParams = () => {
  const [searchParams, setSearchParams] = useState<TResultsSearchRequest>({
    goodsName: '',
    lot: '',
    auctionSeq: '',
  });

  const formChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setSearchParams({
      goodsName: '',
      lot: '',
      auctionSeq: '',
    });
  };

  return { searchParams, formChange,resetForm  };
};
