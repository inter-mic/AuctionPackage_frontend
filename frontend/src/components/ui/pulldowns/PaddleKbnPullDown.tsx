import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
//API
import { usePaddleNumberSearchAPI } from '@/hooks/api/public/usePaddleNumberSearchAPI';

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const PaddleKbnPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { paddleKbnList } = usePaddleNumberSearchAPI();
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    };

  return (
    <select 
      id="searchPaddleKbn"
      name="searchPaddleKbn"
      className={className ?? ''}
      onChange={handleChange}
      >
         <option value="">---</option>
      {paddleKbnList.map(data => (
        <option key={data.paddleKbn} value={data.paddleKbn}>
          {data.paddleKbnName}
        </option>
      ))}
    </select>
  );
};