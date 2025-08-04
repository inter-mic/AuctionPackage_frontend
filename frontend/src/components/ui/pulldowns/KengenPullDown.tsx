import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useKengenGroupSearchAPI } from "@/hooks/api/admin/kengen/useKengenGroupSearchAPI";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const KengenListPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const { kengenGroup } = useKengenGroupSearchAPI();
  const [selectedKengenId, setSelectedKengenId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      if (selectedId !== null && selectedId !== undefined) {
        setSelectedKengenId(selectedId);
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectedKengenId !== null) {
      onChange(selectedKengenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKengenId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKengenId(event.target.value);
  };

  return (
    <select
      id="kengenId"
      name="kengenId"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedKengenId ?? ""}
    >
      <option value="0">---</option>
      {kengenGroup.map((data) => (
        <option key={data.kengenId} value={data.kengenId}>
          {data.kengenName}
        </option>
      ))}
    </select>
  );
};
