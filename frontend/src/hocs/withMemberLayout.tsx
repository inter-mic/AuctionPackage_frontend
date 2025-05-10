import React from 'react';
//コンポーネント
import { MemberLayoutComponent } from '@/components/member/layout/MemberLayoutComponent';
//型定義
import { TPageProps } from '@/types/member/memberPage';
const withMemberLayout = <P extends TPageProps>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <MemberLayoutComponent {...props}>
        <Component {...props} />
      </MemberLayoutComponent>
    );
  };

  // HOCにdisplayNameを設定
  WrappedComponent.displayName = `withMemberLayout(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export default withMemberLayout;