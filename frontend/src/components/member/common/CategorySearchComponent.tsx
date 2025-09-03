import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useCategorySearchAPI } from "@/hooks/api/public/useCategorySearchAPI";
import formSearchStyles from "@/styles/member/FormSearch.module.css";

interface Props {
  selectedCategories: number[];
  onCategoryChange: (id: number) => void;
  categoryLabel?: string;
}

export const CategorySearchComponent: React.FC<Props> = ({
  selectedCategories,
  onCategoryChange,
  categoryLabel = "カテゴリー",
}) => {
  const { category } = useCategorySearchAPI();

  return (
    <div className={formSearchStyles.formItem}>
      <label className="mt-5" htmlFor="category">
        {categoryLabel}
      </label>
      <div className={formSearchStyles.categoryGrid}>
        {category.map((data) => (
          <FormControlLabel
            key={data.categorySeq}
            control={
              <Checkbox
                checked={selectedCategories.includes(data.categorySeq)}
                onChange={() => onCategoryChange(data.categorySeq)}
                sx={{
                  color: "#c7c7c7",
                  "&.Mui-checked": { color: "gray" },
                }}
              />
            }
            label={data.categoryName}
          />
        ))}
      </div>
    </div>
  );
};
