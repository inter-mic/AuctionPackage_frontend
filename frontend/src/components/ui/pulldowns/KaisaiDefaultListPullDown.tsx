import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//API
import { useAuctionSearchAPI } from '@/hooks/api/admin/auction/useAuctionSearchAPI';



type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  disabled?: boolean;  
  kaisaiStatus: number;
};

//デフォルトが直近回となる開催回プルダウンメニュー
export const KaisaiDefaultListPullDown = ({ className, onChange, selectedId, disabled, kaisaiStatus }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { auction } = useAuctionSearchAPI(kaisaiStatus);
  const [selectedAuctionSeq, setSelectedAuctionSeq] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedAuctionSeq(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedAuctionSeq !== null) {
      onChange(selectedAuctionSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuctionSeq]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuctionSeq(event.target.value);
  };

  useEffect(() => {
    if (auction.length > 0) {
      const defaultAuctionSeq = String(auction[0].auctionSeq);
      setSelectedAuctionSeq(defaultAuctionSeq);
    }
  }, [auction]);

  return (
    <select 
      id="auctionSeq"
      name="auctionSeq"
      className={className ?? ''}
      onChange={handleChange}
      value={selectedAuctionSeq  ?? ''}
      disabled={disabled}
      >
      {auction.map(data => (
        <option key={data.auctionSeq} value={data.auctionSeq}>
          {data.auctionName}
        </option>
      ))}
    </select>
  );
};