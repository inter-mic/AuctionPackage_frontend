import { GetServerSidePropsContext } from 'next';

export const useAdminAuthCheck = async (context: GetServerSidePropsContext) => {
  const jsessionid = context.req.cookies['JSESSIONID'];
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}authCheck`, {
    method: 'GET',
    headers: {
      'Cookie': `JSESSIONID=${jsessionid}`
    }
  });
  if (!response.ok) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const sessionData = await response.json();
  const { username = null,
     faviconImagePath = null, 
     logoImagePath = null,
     kengen = null, 
     optionInvoice = false, 
     optionLiveMessage = false, 
     optionLiveYoutube = false } = sessionData;

  return {
    props: {
      username,
      faviconImagePath,
      logoImagePath,
      kengen,
      optionInvoice,
      optionLiveMessage,
      optionLiveYoutube,
    },
  };
};