import React from 'react';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';



type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const ImageDownloadPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const [selectedImageDownload, setSelectedImageDownload] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedImageDownload(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedImageDownload !== null) {
      onChange(selectedImageDownload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageDownload]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImageDownload(event.target.value);
  };

  return (
    <select 
        id="imageDownloadFlg"
        name="imageDownloadFlg"
        className={className ?? ''}
        onChange={handleChange}
        value={selectedImageDownload  ?? ''
        }>
      <option value="0">{texts.system.allow}</option>
      <option value="1">{texts.system.deny}</option>
      
    </select>
  );
};