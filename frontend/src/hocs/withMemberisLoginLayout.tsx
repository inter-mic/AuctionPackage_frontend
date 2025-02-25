import React from 'react';
//コンポーネント
import { MemberLayoutComponent } from '@/components/member/common/MemberLayoutComponent';
//型定義
import { TPageProps } from '@/types/member/memberPage';

const withMemberisLoginLayout = <P extends TPageProps>(
  Component: React.FC<P>, 
  isLogin: boolean
) => {
  const WrappedComponent = (props: P) => {
    return (
      <MemberLayoutComponent {...props}>
        <Component {...props} isLogin={isLogin} loginUserId={props.userId} />
      </MemberLayoutComponent>
    );
  };

  // HOCにdisplayNameを設定
  WrappedComponent.displayName = `withMemberisLoginLayout(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};


export default withMemberisLoginLayout;