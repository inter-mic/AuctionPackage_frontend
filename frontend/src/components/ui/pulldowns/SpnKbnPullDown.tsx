import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useSpnKbnSearch } from "@/hooks/api/admin/spnKbn/useSpnKbnSearch";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const SpnKbnPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const { spnKbn } = useSpnKbnSearch();
  const [selectedSpnKbn, setSelectedSpnKbn] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== undefined && selectedId !== null) {
      setSelectedSpnKbn(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedSpnKbn !== null) {
      onChange(selectedSpnKbn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpnKbn]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpnKbn(event.target.value);
  };

  return (
    <select
      id="spnKbn"
      name="spnKbn"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedSpnKbn ?? ""}
    >
      <option value="">---</option>
      {spnKbn.map((item) =>
        Object.entries(item).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))
      )}
    </select>
  );
};
