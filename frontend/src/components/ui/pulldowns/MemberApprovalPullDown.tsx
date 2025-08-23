import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const MemberApprovalPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, texts } = useCommonSetup();
  const [selectedMemberApproval, setSelectedMemberApproval] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedMemberApproval(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedMemberApproval !== null) {
      onChange(selectedMemberApproval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemberApproval]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMemberApproval(event.target.value);
  };

  return (
    <select
      id="memberApprovalFlg"
      name="memberApprovalFlg"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedMemberApproval ?? ""}
    >
      <option value="0">{texts.system.approve}</option>
      <option value="1">{texts.system.reject}</option>
    </select>
  );
};
