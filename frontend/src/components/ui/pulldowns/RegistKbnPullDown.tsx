import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const RegistKbnPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, texts } = useCommonSetup();
  const [selectedRegistKbn, setSelectedRegistKbn] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedRegistKbn(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedRegistKbn !== null) {
      onChange(selectedRegistKbn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegistKbn]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegistKbn(event.target.value);
  };

  return (
    <select
      id="registKbn"
      name="registKbn"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedRegistKbn ?? ""}
    >
      <option value="1">{texts.goods.goodsId}</option>
      <option value="2">{texts.goods.SKU}</option>
    </select>
  );
};
