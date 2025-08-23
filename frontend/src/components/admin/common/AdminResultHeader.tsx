import React from "react";
import adminStyles from "@/styles/admin/AdminCommon.module.css";

type SortOption = {
  value: string;
  label: string;
};

type AdminResultHeaderProps = {
  count: number;
  sortName: string;
  onSortNameChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortFlgChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: SortOption[];
  ascText: string;
  descText: string;
  children?: React.ReactNode; // CSV出力ボタンなどの追加要素
};

export const AdminResultHeader: React.FC<AdminResultHeaderProps> = ({
  count,
  sortName,
  onSortNameChange,
  onSortFlgChange,
  sortOptions,
  ascText,
  descText,
  children,
}) => {
  return (
    <div className="block sm:flex flex-col sm:flex-row justify-between items-center p-4">
      <div className="text-left">
        <div className={adminStyles.resultContainer}>
          <div className={adminStyles.resultRow}>
            <span className={adminStyles.resultLabel}>件数：</span>
            <span>{count.toLocaleString()} 件</span>
          </div>
          <div className={adminStyles.resultRow}>
            <label className={adminStyles.resultLabel}>並び順：</label>
            <select
              id="sortName"
              className={adminStyles.sort}
              value={sortName}
              onChange={onSortNameChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select id="sortFlg" className={adminStyles.sort} onChange={onSortFlgChange}>
              <option value="asc">{ascText}</option>
              <option value="desc">{descText}</option>
            </select>
          </div>
        </div>
      </div>
      {children && <div className="text-right">{children}</div>}
    </div>
  );
};
