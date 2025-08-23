import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useInfoSearchAPI } from "@/hooks/api/admin/info/useInfoSearchAPI";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  disabled?: boolean;
};

export const AllInfoListPullDown = ({ className, onChange, selectedId, disabled }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const { info } = useInfoSearchAPI();
  const [selectedInfoSeq, setSelectedInfoSeq] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedInfoSeq(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedInfoSeq !== null) {
      onChange(selectedInfoSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInfoSeq]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInfoSeq(event.target.value);
  };

  return (
    <select
      id="infoSeq"
      name="naiyo"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedInfoSeq ?? ""}
      disabled={disabled}
    >
      <option value="">---</option>
      {info.map((data) => (
        <option key={data.infoSeq} value={data.infoSeq}>
          {data.naiyo}
        </option>
      ))}
    </select>
  );
};
