import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const KekkaStatusPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, texts } = useCommonSetup();
  const [selectedKekkaStatus, setSelectedKekkaStatus] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      if (selectedId !== null && selectedId !== undefined) {
        setSelectedKekkaStatus(selectedId);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectedKekkaStatus !== null) {
      onChange(selectedKekkaStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKekkaStatus]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKekkaStatus(event.target.value);
  };

  return (
    <select
      id="kekkaStatus"
      name="kekkaStatus"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedKekkaStatus ?? ""}
    >
      <option value="">---</option>
      <option value="1">{texts.pulldown.furakusatsu}</option>
      <option value="2">{texts.pulldown.rakusatsu}</option>
    </select>
  );
};
