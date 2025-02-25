import React from 'react';
import { AdminNoHeaderLayoutComponent } from '@/components/admin/AdminNoHeaderLayoutComponent';
import { PageProps } from '@/types/admin/adminPage';
const withAdminNoHeaderLayout = <P extends PageProps>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <AdminNoHeaderLayoutComponent {...props}>
        <Component {...props} />
      </AdminNoHeaderLayoutComponent>
    );
  };

    // HOCにdisplayNameを設定
    WrappedComponent.displayName = `withAdminNoHeaderLayout(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
};

export default withAdminNoHeaderLayout;