import { useState } from 'react';
//型定義
import { TGoodsSearchRequest } from '@/types/common/goods';



export const useGoodsSearchParams = () => {
  const [goodsParams, setGoodsParams] = useState<TGoodsSearchRequest>({
    goodsId: '',
    goodsName: '',
    categorySeq: '',
    lot: '',
    auctionSeq: '',
    startCurrentPriceFrom: '',
    startCurrentPriceTo: '',
    freeWord: '',
    countFlg: false,
    pageNumber:1,
    pageSize:50,
  });

  const formChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setGoodsParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setGoodsParams(prevParams => ({
      ...prevParams,
      goodsId: '',
      goodsName: '',
      categorySeq: '',
      lot: '',
      startCurrentPriceFrom: '',
      startCurrentPriceTo: '',
      freeWord: '',
    }));
  };
  

  return { goodsParams, formChange,resetForm  };
};
