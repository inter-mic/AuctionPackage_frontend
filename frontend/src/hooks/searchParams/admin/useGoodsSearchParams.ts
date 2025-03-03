import { useState } from 'react';
//型定義
import { TAdminGoodsSearchRequest } from '@/types/admin/goods/search';

export const useGoodsSearchParams = () => {
  const [goodsParams, setGoodsParams] = useState<TAdminGoodsSearchRequest>({
    goodsId: '',
    goodsName: '',
    sku: '',
    categorySeq: '',
    lotFrom: '',
    lotTo: '',
    auctionSeq: '',
    keisaiFlg: '',
    kekkaStatus: '',
    shuppinUserId: '',
    shuppinUserName: '',
    rakusatsuUserId: '',
    rakusatsuUserName: '',
    freeWord: '',
    pageNumber:1,
    pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
  });

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoodsParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };

  const resetForm = () => {
    setGoodsParams({
      goodsId: '',
      goodsName: '',
      categorySeq: '',
      lotFrom: '',
      lotTo: '',
      auctionSeq: '',
      keisaiFlg: '',
      kekkaStatus: '',
      shuppinUserId: '',
      shuppinUserName: '',
      rakusatsuUserId: '',
      rakusatsuUserName: '',
      freeWord: '',
      pageNumber:1,
      pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
    });
  };

  return { goodsParams, formChange, resetForm };
};
