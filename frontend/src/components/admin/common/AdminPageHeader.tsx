import React from "react";
import breadcrumbStyles from "@/styles/breadcrumb.module.css";

type AdminPageHeaderProps = {
  title: string;
};

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title }) => {
  return (
    <div className={breadcrumbStyles.breadcrumb}>
      <span className={breadcrumbStyles.breadcrumbItem}>{title}</span>
    </div>
  );
};

