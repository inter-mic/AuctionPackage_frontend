import { GetServerSideProps } from 'next';
//API
import { useSystemSettingAPI } from '@/hooks/api/public/useSystemSettingAPI';



export const withSystemSetting = (gssp: GetServerSideProps,memberRegistrationCheck:boolean,nologinViewCheck:boolean): GetServerSideProps => {
  return async (context) => {
    const res = await useSystemSettingAPI(context,memberRegistrationCheck,nologinViewCheck);
    if ('redirect' in res) {
      return res;
    }
    const gsspResult = await gssp(context); 

    if ('props' in gsspResult) {
    return {
      props: {
        ...res.props,
        ...gsspResult.props,   
      },
    };
  };

  return gsspResult;
  };
};