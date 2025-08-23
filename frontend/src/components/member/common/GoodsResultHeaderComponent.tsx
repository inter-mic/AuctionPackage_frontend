import React from "react";
import memberStyles from "@/styles/member/MemberCommon.module.css";
import styles from "@/styles/member/goods/GoodsList.module.css";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
interface SortOption {
  value: string;
  label: string;
}

interface Props {
  count: number;
  sortOption: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: SortOption[];
}

export const ResultHeaderComponent: React.FC<Props> = ({
  count,
  sortOption,
  onSortChange,
  sortOptions,
}) => {
  const { texts } = useCommonSetup();
  return (
    <div className={`${memberStyles.memberContainer} py-5`}>
      <div className={styles.headerContainer}>
        <span>
          {count.toLocaleString()} {texts.label.resultCount}
        </span>
        <div className={styles.sortContainer}>
          <label htmlFor="sort">{texts.label.sort}</label>
          <select id="sort" value={sortOption} onChange={onSortChange}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
