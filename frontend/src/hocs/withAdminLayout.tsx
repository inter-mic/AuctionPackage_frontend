import React from 'react';
import { AdminLayoutComponent } from '@/components/admin/AdminLayoutComponent';
import { PageProps } from '@/types/admin/adminPage';
const withAdminLayout = <P extends PageProps>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <AdminLayoutComponent {...props}>
        <Component {...props} />
      </AdminLayoutComponent>
    );
  };
  WrappedComponent.displayName = `withAdminLayout(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export default withAdminLayout;