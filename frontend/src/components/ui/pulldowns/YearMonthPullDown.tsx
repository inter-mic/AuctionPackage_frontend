import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { TYearMonthSelect } from "@/types/public/yearMonth";
type Props = {
  className?: string | null;
  yearMonth: TYearMonthSelect[];
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
  isFrom: boolean;
};

export const YearMonthPullDown = ({ className, onChange, selectedId, yearMonth, isFrom }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const [selectedYearMonth, setSelectedYearMonth] = useState<string | null>(null);
  const [yearMonthList, setYearMonthlist] = useState<TYearMonthSelect[]>([]);

  // 6ヶ月前の年月を計算する関数
  const getSixMonthsAgo = (): string => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const year = sixMonthsAgo.getFullYear();
    const month = String(sixMonthsAgo.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };

  // 初期値を設定する関数
  const getInitialValue = (list: TYearMonthSelect[]): string => {
    if (list.length === 0) {
      return "";
    }

    if (!isFrom) {
      // isFromがfalseの場合はリストの一番最初の値を返す
      return list[0].yearMonth;
    }

    const sixMonthsAgo = getSixMonthsAgo();
    
    // 6ヶ月前の年月がリストに含まれているかチェック
    const sixMonthsAgoIndex = list.findIndex(item => item.yearMonth >= sixMonthsAgo);
    
    if (sixMonthsAgoIndex !== -1) {
      return list[sixMonthsAgoIndex].yearMonth;
    } else {
      // 6ヶ月前の年月がリストにない場合は最後の値を返す
      return list[list.length - 1].yearMonth;
    }
  };

  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedYearMonth(selectedId);
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
      
      // isFromがtrueで初期値が設定されていない場合、初期値を設定
      if (isFrom && selectedYearMonth === null && yearMonth.length > 0) {
        const initialValue = getInitialValue(yearMonth);
        setSelectedYearMonth(initialValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearMonth, isFrom]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYearMonth(event.target.value);
  };

  const fieldId = isFrom ? "yearMonthFrom" : "yearMonthTo";
  const fieldName = isFrom ? "yearMonthFrom" : "yearMonthTo";

  return (
    <select
      id={fieldId}
      name={fieldName}
      className={className ?? ""}
      onChange={handleChange}
      value={selectedYearMonth ?? ""}
    >
      {yearMonthList.map((data) => (
        <option key={data.yearMonth} value={data.yearMonth}>
          {data.yearMonthStr}
        </option>
      ))}
    </select>
  );
};
