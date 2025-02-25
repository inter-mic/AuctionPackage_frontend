import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';


type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const KeisaiFlgPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [selectedKeisaiFlg, setSelectedKeisaiFlg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedKeisaiFlg !== null) {
      onChange(selectedKeisaiFlg);
    }
  }, [selectedKeisaiFlg, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKeisaiFlg(event.target.value);
  };

  return (
    <select 
      id="keisaiFlg"
      name="keisaiFlg"
      className={className ?? ''}
      onChange={handleChange}
      value={selectedKeisaiFlg  ?? ''}
    >
      <option value="">---</option>
      <option value="1">{texts.pulldown.keisaiFlgOn}</option>
      <option value="0">{texts.pulldown.keisaiFlgOff}</option>
    </select>
  );
};