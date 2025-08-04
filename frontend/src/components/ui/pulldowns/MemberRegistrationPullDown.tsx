import React from "react";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

type Props = {
  className?: string | null;
  onChange: (selectedId: string) => void;
  selectedId?: string | null;
};

export const MemberRegistrationPullDown = ({ className, onChange, selectedId }: Props) => {
  const { useState, useEffect, texts } = useCommonSetup();
  const [selectedMemberRegistration, setSelectedMemberRegistration] = useState<string | null>(null);
  useEffect(() => {
    if (selectedId !== null && selectedId !== undefined) {
      setSelectedMemberRegistration(selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (selectedMemberRegistration !== null) {
      onChange(selectedMemberRegistration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemberRegistration]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMemberRegistration(event.target.value);
  };

  return (
    <select
      id="memberRegistrationFlg"
      name="memberRegistrationFlg"
      className={className ?? ""}
      onChange={handleChange}
      value={selectedMemberRegistration ?? ""}
    >
      <option value="0">{texts.system.adminOnly}</option>
      <option value="1">{texts.system.adminAndMember}</option>
    </select>
  );
};
