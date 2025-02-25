import { GetServerSideProps } from 'next';
//カスタムフック
import { useMemberAuthCheck } from '@/hooks/api/member/useMemberAuthCheck';

export const withAuth = (gssp: GetServerSideProps): GetServerSideProps => {
  return async (context) => {
    const authResult = await useMemberAuthCheck(context);
    if ('redirect' in authResult) {
      return authResult;
    }
    const gsspResult = await gssp(context); 
    if ('props' in gsspResult) {
      return {
        props: {
          ...authResult.props,    
          ...gsspResult.props,
        },
      };
    }

    return gsspResult;
  };
};