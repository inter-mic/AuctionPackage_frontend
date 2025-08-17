import { GetServerSidePropsContext } from "next";

export const useMemberAuthCheck = async (context: GetServerSidePropsContext) => {
  const cookieHeader = context.req.headers["cookie"] ?? "";
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEMBER_API_URL}authCheck`, {
    method: "POST",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
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
      userId: data.userId,
      userName: data.userName,
      faviconImagePath: data.faviconImagePath,
      logoImagePath: data.logoImagePath,
      memberApprovalFlg: data.memberApprovalFlg,
      memberRegistrationFlg: data.memberRegistrationFlg,
      nologinView: data.nologinView,
      kiyakuPath: data.kiyakuPath,
      privacyPolicyPath: data.privacyPolicyPath,
      optionMemInvoice: data.optionMemInvoice,
      livebit: data.livebit,
      auction: data.auction,
      liveauction: data.liveauction,
      tender: data.tender,
      companyName: data.companyName,
      zipCode: data.zipCode,
      todofukenName: data.todofukenName,
      address1: data.address1,
      address2: data.address2,
      tel: data.tel,
      fax: data.fax,
      mail: data.mail,
      companyUrl: data.companyUrl,
      kobutsuBango: data.kobutsuBango,
      copyRight: data.copyRight,
      pageSettingList: data.pageSettingList || [],
    },
  };
};
