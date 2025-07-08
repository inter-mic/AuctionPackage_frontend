import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  spnKbn: string;
};

export const BidKbnPullDown = ({ className, onChange, selectedId, spnKbn }: Props) => {
  const { texts } = useCommonSetup();
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const getBidKbnOptions = () => {
    if (spnKbn === "1") {
      return [
        { value: "10", label: "会場" },
        { value: "11", label: "オンライン" }
      ];
    } else if (spnKbn === "2") {
      return [
        { value: "1", label: "事前入札" },
        { value: "2", label: "ライブオークション入札" }
      ];
    }
    return [];
  };

  const options = getBidKbnOptions();

  return (
    <select 
      id="bidKbn"
      name="bidKbn"
      className={className ?? ''}
      onChange={handleChange}
      value={selectedId ?? ''}
    >
      <option value="">---</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}; 