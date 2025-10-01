import { GetServerSidePropsContext } from "next";

export const useMemberAuthCheck = async (context: GetServerSidePropsContext) => {
  const cookieHeader = context.req.headers["cookie"] ?? "";
  
  // HttpOnly Cookieの存在確認
  const hasSecureCookies = cookieHeader.includes('sessionId') || cookieHeader.includes('authToken');
  const hasHttpOnlyCookies = cookieHeader.includes('sessionId') && cookieHeader.includes('authToken');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEMBER_API_URL}authCheck`, {
    method: "POST",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
      'X-Secure-Cookies': hasSecureCookies ? 'true' : 'false',
      'X-HttpOnly-Cookies': hasHttpOnlyCookies ? 'true' : 'false',
    },
  });
  
  if (!response.ok) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const data = await response.json();
  return {
    props: {
      userId: data.userId || null,
      userName: data.userName || null,
      canBid: data.canBid ?? null,
      faviconImagePath: data.faviconImagePath || null,
      logoImagePath: data.logoImagePath || null,
      memberApprovalFlg: data.memberApprovalFlg || false,
      memberRegistrationFlg: data.memberRegistrationFlg || false,
      nologinView: data.nologinView || false,
      kiyakuPath: data.kiyakuPath || "",
      privacyPolicyPath: data.privacyPolicyPath || "",
      optionMemInvoice: data.optionMemInvoice || false,
      optionMemShuppinList: data.optionMemShuppinList || false,
      livebit: data.livebit || false,
      auction: data.auction || false,
      liveauction: data.liveauction || false,
      tender: data.tender || false,
      companyName: data.companyName || null,
      zipCode: data.zipCode || null,
      todofukenName: data.todofukenName || null,
      address1: data.address1 || null,
      address2: data.address2 || null,
      tel: data.tel || null,
      fax: data.fax || null,
      mail: data.mail || null,
      companyUrl: data.companyUrl || null,
      kobutsuBango: data.kobutsuBango || null,
      copyRight: data.copyRight || null,
      pageSettingList: data.pageSettingList || [],
    },
  };
};
