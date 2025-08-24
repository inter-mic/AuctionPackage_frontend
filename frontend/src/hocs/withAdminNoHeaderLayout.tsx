import React from "react";
import { AdminNoLoginHeaderLayoutComponent } from "@/components/admin/layout/AdminNoLoginHeaderLayoutComponent";
import { PageProps } from "@/types/admin/adminPage";
const withAdminNoHeaderLayout = <P extends PageProps>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <AdminNoLoginHeaderLayoutComponent {...props}>
        <Component {...props} />
      </AdminNoLoginHeaderLayoutComponent>
    );
  };

  // HOCにdisplayNameを設定
  WrappedComponent.displayName = `withAdminNoHeaderLayout(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

export default withAdminNoHeaderLayout;
