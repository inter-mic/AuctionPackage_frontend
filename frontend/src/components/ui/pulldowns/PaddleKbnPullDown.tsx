import React from 'react';
//カスタムフック

//型定義
import { TMtPaddleNumber } from '@/types/public/paddleNumber';
type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  paddleKbnList: TMtPaddleNumber[]  
};

export const PaddleKbnPullDown = ({ className, onChange, selectedId, paddleKbnList }: Props) => {
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