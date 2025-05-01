import React, { useState, useEffect } from 'react';
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useMessageSearchAPI } from '@/hooks/api/admin/live/message/useMessageSearchAPI';

type Props = {
  className?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const LiveMessageListPullDown: React.FC<Props> = ({
  className,
  onChange,
  disabled,
}) => {
  const { message } = useMessageSearchAPI();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    onChange(inputValue);
  }, [inputValue, onChange]);

  return (
    <>
      <input
        type="text"
        list="liveMessageList"
        className={className}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        disabled={disabled}
        placeholder="テキスト入力もしくはダブルクリック"
      />
      <datalist id="liveMessageList">
        <option value="">───</option>
        {message.map(m => (
          <option key={m.messageSeq} value={m.message} />
        ))}
      </datalist>
    </>
  );
};
