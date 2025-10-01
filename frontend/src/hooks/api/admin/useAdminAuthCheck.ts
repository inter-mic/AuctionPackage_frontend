import { GetServerSidePropsContext } from "next";

export const useAdminAuthCheck = async (context: GetServerSidePropsContext) => {
  const cookieHeader = context.req.headers['cookie'] ?? '';
  
  // __Host-プレフィックス付きCookieの存在確認
  const hasSecureCookies = cookieHeader.includes('__Host-sessionId') || cookieHeader.includes('__Host-authToken');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}authCheck`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
      'X-Secure-Cookies': hasSecureCookies ? 'true' : 'false',
    },
  });
  if (!response.ok) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const sessionData = await response.json();
  const {
    username = null,
    faviconImagePath = null,
    logoImagePath = null,
    kengen = null,
    livebit = false,
    liveauction = false,
    auction = false,
    tender = false,
    optionInvoice = false,
    optionLiveMessage = false,
    optionLiveYoutube = false,
  } = sessionData;

  return {
    props: {
      username,
      faviconImagePath,
      logoImagePath,
      kengen,
      livebit,
      liveauction,
      auction,
      tender,
      optionInvoice,
      optionLiveMessage,
      optionLiveYoutube,
    },
  };
};
