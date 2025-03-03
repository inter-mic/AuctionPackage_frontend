import { useState } from 'react';
//型定義
import { TGoodsAuctionBidAdminSearchRequest } from '@/types/admin/bid/search';

export const useBidSearchParams = () => {
  const [bidParams, setBidParams] = useState<TGoodsAuctionBidAdminSearchRequest>({
    goodsId: '',
    goodsName: '',
    sku: '',
    auctionSeq: '',
    lotFrom: '',
    lotTo: '',
    userId: '',
    userName: '',
    pageNumber:1,
    pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
  });

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBidParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };
  const resetForm = () => {
    setBidParams({
      goodsId: '',
      sku: '',
      goodsName: '',
      auctionSeq: '',
      lotFrom: '',
      lotTo: '',
      userId: '',
      userName: '',
      pageNumber:1,
      pageSize:Number(`${process.env.NEXT_PUBLIC_PAGE_SIZE}`)
    });
  };

  return { bidParams, formChange,resetForm };
};
