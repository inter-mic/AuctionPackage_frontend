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
  const { paddleKbnList } = usePaddleNumberSearchAPI();
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    };

  return (
    <select 
      id="paddleKbn"
      name="paddleKbn"
      className={className ?? ''}
      onChange={handleChange}
      value={selectedId ?? ''}
      >
         <option value="">---</option>
      {paddleKbnList.map(data => (
        <option key={data.paddleKbn} value={data.paddleKbn}>
          {data.paddleKbnName} ( {data.paddleNoFrom} ~ {data.paddleNoTo} )  
        </option>
      ))}
    </select>
  );
};