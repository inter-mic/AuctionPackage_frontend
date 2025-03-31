import { GetServerSidePropsContext } from 'next';



export const useSystemSettingAPI = async (context: GetServerSidePropsContext,memberRegistrationCheck:boolean,nologinViewCheck:boolean) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}systemSetting/search`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const data = await response.json();

  if( (memberRegistrationCheck && !data.memberRegistrationFlg) ||
  (nologinViewCheck && !data.nologinView)
  ){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }


  return {
    props: {
      faviconImagePath: data.faviconImagePath || '',
      logoImagePath: data.logoImagePath || '',
      memberApprovalFlg: data.memberApprovalFlg ,
      memberRegistrationFlg: data.memberRegistrationFlg ,
      nologinView: data.nologinView ,
      optionMemInvoice: data.optionMemInvoice ,
      kiyakuPath: data.kiyakuPath || '',
      privacyPolicyPath: data.privacyPolicyPath || '',
      companyName: data.companyName || '',
      zipCode: data.zipCode || '',
      todofukenName: data.todofukenName || '',
      address1: data.address1 || '',
      address2: data.address2 || '',
      tel: data.tel || '',
      fax: data.fax || '',
      mail: data.mail || '',
      companyUrl: data.companyUrl || '',
      kobutsuBango: data.kobutsuBango || '',
      copyRight: data.copyRight || '',
      pageSettingList: data.pageSettingList || [],
    },
  };
};