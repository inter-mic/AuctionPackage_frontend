import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useCategorySearchAPI } from "@/hooks/api/admin/category/useCategorySearchAPI";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const CategoryListPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect } = useCommonSetup();
  const { category } = useCategorySearchAPI();
  const [selectedCategorySeq, setSelectedCategorySeq] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      if (selectedId !== null && selectedId !== undefined) {
        setSelectedCategorySeq(selectedId);
      }
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedCategorySeq !== null) {
      onChange(selectedCategorySeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategorySeq]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategorySeq(event.target.value);
  };

  return (
    <select
      id="categorySeq"
      name="categorySeq"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedCategorySeq ?? ""}
    >
      <option value="">---</option>
      {category.map((data) => (
        <option key={data.categorySeq} value={data.categorySeq}>
          {data.categoryName}
        </option>
      ))}
    </select>
  );
};
