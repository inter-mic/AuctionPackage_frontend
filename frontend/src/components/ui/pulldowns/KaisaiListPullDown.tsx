import React from 'react';
import  dayjs,{ Dayjs } from 'dayjs';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//API
import { useAuctionSearchAPI } from '@/hooks/api/admin/auction/useAuctionSearchAPI';
//型定義
import { TMtAuction } from '@/types/admin/auction/search';


type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  disabled?: boolean;  
  kaisaiStatus: number;
  defaultSetOption?:number; 
  spnKbn?: number;
};

export const KaisaiListPullDown = ({ className, onChange, selectedId, disabled, kaisaiStatus, defaultSetOption, spnKbn }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { auction } = useAuctionSearchAPI(kaisaiStatus,spnKbn ?? 0);
  const [selectedAuctionSeq, setSelectedAuctionSeq] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {      
      setSelectedAuctionSeq(selectedId);
    } 
  }, [selectedId]);

  useEffect(() => {
 if (defaultSetOption !== 0) {
      const now = dayjs();
      let defaultAuction: TMtAuction | undefined;
      if (defaultSetOption === 1) {
        //未来のオークションがあれば、それを選択。なければ、直近に終了したオークションを選択する。
        defaultAuction = auction
          .filter(data => data.displayEndtime && data.displayEndtime.isAfter(now))
          .sort((a, b) => (a.displayEndtime!.isAfter(b.displayEndtime!) ? 1 : -1))[0] 
          ?? auction
          .filter(data => data.displayEndtime && data.displayEndtime.isBefore(now))
          .sort((a, b) => (b.displayEndtime!.isAfter(a.displayEndtime!) ? 1 : -1))[0];

      } else if (defaultSetOption === 2) {
        //一番直近で入札期間が終了したオークション
        defaultAuction = auction
          .filter(data => data.displayEndtime && data.displayEndtime.isBefore(now))
          .sort((a, b) => (b.displayEndtime!.isAfter(a.displayEndtime!) ? 1 : -1))[0];
      }
      
      if (defaultAuction) {
        setSelectedAuctionSeq(defaultAuction.auctionSeq.toString());
      }
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction]);
  useEffect(() => {
    if (selectedAuctionSeq !== null) {
      onChange(selectedAuctionSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuctionSeq]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuctionSeq(event.target.value);
  };

  return (
    <select 
      id="auctionSeq"
      name="auctionSeq"
      className={className ?? ''}
      onChange={handleChange}
      value={selectedAuctionSeq  ?? ''}
      disabled={disabled}
      >
         <option value="">---</option>
      {auction.map(data => (
        <option key={data.auctionSeq} value={data.auctionSeq}>
          {data.auctionName}
        </option>
      ))}
    </select>
  );
};