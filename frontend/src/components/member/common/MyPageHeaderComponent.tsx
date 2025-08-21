import React from "react";
import memberStyles from "@/styles/member/MemberCommon.module.css";

type Props = {
  title: string;
};

export const MyPageHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className={memberStyles.mainTitleContainer}>
      <span className={memberStyles.mainTitle}>{title}</span>
    </div>
  );
};
