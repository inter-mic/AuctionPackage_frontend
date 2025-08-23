import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { TYearMonthSelect } from "@/types/public/yearMonth";
type Props = {
  className?: string | null;
  yearMonth: TYearMonthSelect[];
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const YearMonthPullDown = ({ className, onChange, selectedId, yearMonth }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const [selectedYearMonth, setSelectedYearMonth] = useState<string | null>(null);
  const [yearMonthList, setYearMonthlist] = useState<TYearMonthSelect[]>([]);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      if (selectedId !== null && selectedId !== undefined) {
        setSelectedYearMonth(selectedId);
      }
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedYearMonth !== null) {
      onChange(selectedYearMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYearMonth]);
  useEffect(() => {
    if (yearMonth !== null) {
      setYearMonthlist(yearMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearMonth]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYearMonth(event.target.value);
  };

  return (
    <select
      id="yearMonth"
      name="yearMonth"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedYearMonth ?? ""}
    >
      <option value="">---</option>
      {yearMonthList.map((data) => (
        <option key={data.yearMonth} value={data.yearMonth}>
          {data.yearMonthStr}
        </option>
      ))}
    </select>
  );
};
