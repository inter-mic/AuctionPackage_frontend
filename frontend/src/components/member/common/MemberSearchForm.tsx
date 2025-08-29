import React from "react";
//コンポーネント
import { KaisaiListPullDown } from "@/components/ui/pulldowns/MemberKaisaiListPullDown";
import { KekkaStatusPullDown } from "@/components/ui/pulldowns/KekkaStatusPullDown";
import { RequiredMark } from "@/components/ui/marks/RequiredMark";
//ボタン
import { SearchButton } from "@/components/ui/buttons/member/searchButton";
import { ClearButton } from "@/components/ui/buttons/member/clearButton";
//スタイル
import formSearchStyles from "@/styles/member/FormSearch.module.css";

interface SearchField {
  name: string;
  label: string;
  type: "input" | "select" | "kekkaStatus";
  required?: boolean;
  placeholder?: string;
}

interface MemberSearchFormProps {
  searchParams: Record<string, string>;
  formChange: (e: { target: { name: string; value: string } }) => void;
  onSearch: () => void;
  onClear: () => void;
  formErrors?: Record<string, string>;
  fields: SearchField[];
  selectedKaisai: string;
  onKaisaiChange: (name: string, value: string) => void;
  selectedKekkaStatus?: string | null;
  onKekkaStatusChange?: (name: string, value: string) => void;
  kaisaiStatus?: number;
  isLogin?: boolean;
}

export const MemberSearchForm: React.FC<MemberSearchFormProps> = ({
  searchParams,
  formChange,
  onSearch,
  onClear,
  formErrors = {},
  fields,
  selectedKaisai,
  onKaisaiChange,
  selectedKekkaStatus,
  onKekkaStatusChange,
  kaisaiStatus = 1,
  isLogin = true,
}) => {
  const renderField = (field: SearchField) => {
    const { name, label, type, required = false, placeholder } = field;

    if (type === "select" && name === "auctionSeq") {
      return (
        <div className={formSearchStyles.formItem} key={name}>
          <label htmlFor={name}>
            {required && <RequiredMark />}
            {label}
          </label>
          <KaisaiListPullDown
            className=""
            onChange={(value) => onKaisaiChange(name, value)}
            selectedId={selectedKaisai !== null ? String(selectedKaisai) : ""}
            kaisaiStatus={kaisaiStatus}
            isLogin={isLogin}
          />
          {formErrors?.[name] && <p className="error-message">{formErrors[name]}</p>}
        </div>
      );
    }

    if (type === "kekkaStatus") {
      return (
        <div className={formSearchStyles.formItem} key={name}>
          <label htmlFor={name}>{label}</label>
          <KekkaStatusPullDown
            onChange={(value) => onKekkaStatusChange?.(name, value)}
            selectedId={selectedKekkaStatus !== null ? String(selectedKekkaStatus) : ""}
          />
        </div>
      );
    }

    return (
      <div className={formSearchStyles.formItem} key={name}>
        <label htmlFor={name}>
          {required && <RequiredMark />}
          {label}
        </label>
        <input
          id={name}
          name={name}
          value={searchParams[name] || ""}
          onChange={formChange}
          placeholder={placeholder}
        />
      </div>
    );
  };

  return (
    <div className={formSearchStyles.formContainer}>
      <div className={formSearchStyles.formGrid}>
        {fields.map(renderField)}
      </div>
      <div className="text-center lg:text-right">
        <SearchButton onClick={onSearch} />
        <ClearButton onClear={onClear} />
      </div>
    </div>
  );
};

