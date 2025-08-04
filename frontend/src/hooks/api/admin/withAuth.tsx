import { GetServerSideProps, GetServerSidePropsContext } from 'next';


const withAuth = (endPointKbn: string): GetServerSideProps => {
  return async (context: GetServerSidePropsContext) => {
    const getBaseUrl = (endPointKbn: string) => {
        switch (endPointKbn) {
          case 'admin':
            return process.env.NEXT_PUBLIC_ADMIN_API_URL;
          case 'member':
            return process.env.NEXT_PUBLIC_MEMBER_API_URL;
          case 'public':
            return process.env.NEXT_PUBLIC_API_URL;
          default:
            throw new Error('無効なエンドポイント区分です');
        }
      };
    const jsessionid = context.req.cookies['JSESSIONID'];
    const baseUrl = getBaseUrl(endPointKbn);
    const response = await fetch(`${baseUrl}authCheck`, {
      method: 'GET',
      headers: {
        'Cookie': `JSESSIONID=${jsessionid}`
      }
    });

    if (!response.ok) {
      return {
        redirect: {
          destination: '/adminLogin',
          permanent: false,
        },
      };
    }

    const sessionData = await response.json();

    return {
      props: {
        sessionData,
      },
    };
  };
};

export default withAuth;