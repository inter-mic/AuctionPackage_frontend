import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const NologinViewPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [selectedNologinView, setSelectedNologinView] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedNologinView(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedNologinView !== null) {
      onChange(selectedNologinView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNologinView]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNologinView(event.target.value);
  };

  return (
    <select 
        id="nologinView"
        name="nologinView"
        className={className ?? ''}
        onChange={handleChange}
        value={selectedNologinView  ?? ''
        }>
      <option value="0">{texts.system.loginedOnly}</option>
      <option value="1">{texts.system.allMember}</option>
      
    </select>
  );
};