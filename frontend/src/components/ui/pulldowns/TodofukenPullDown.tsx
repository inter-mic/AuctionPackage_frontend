import React from "react";
//API
import { useTodofukenAPI } from "@/hooks/api/public/useTodofukenAPI";

import styles from "@/styles/CommonRegister.module.css";

type Props = {
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const TodofukenPullDown = ({ onChange, selectedId }: Props) => {
  const { todofuken } = useTodofukenAPI();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      id="todofuken_name"
      name="todofuken_name"
      className={`${styles.commonInput} ${styles.input25}`}
      onChange={handleChange}
      value={selectedId ?? ""}
    >
      <option value="">---</option>
      {todofuken.map((data) => (
        <option key={data.todofukenId} value={data.todofukenName}>
          {data.todofukenName}
        </option>
      ))}
    </select>
  );
};
