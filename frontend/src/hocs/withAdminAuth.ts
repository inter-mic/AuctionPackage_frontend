import { GetServerSideProps } from "next";
//カスタムフック
import { useAdminAuthCheck } from "@/hooks/api/admin/useAdminAuthCheck";

export const withAuth = (gssp: GetServerSideProps): GetServerSideProps => {
  return async (context) => {
    const authResult = await useAdminAuthCheck(context);
    if ("redirect" in authResult) {
      return authResult;
    }
    const gsspResult = await gssp(context);
    if ("props" in gsspResult) {
      return {
        props: {
          ...authResult.props,
          ...gsspResult.props,
          userName: authResult.props.username,
          faviconImagePath: authResult.props.faviconImagePath,
          logoImagePath: authResult.props.logoImagePath,
          kengen: authResult.props.kengen,
          livebit: authResult.props.livebit,
          liveauction: authResult.props.liveauction,
          auction: authResult.props.auction,
          tender: authResult.props.tender,
          optionInvoice: authResult.props.optionInvoice,
          optionLiveMessage: authResult.props.optionLiveMessage,
          optionLiveYoutube: authResult.props.optionLiveYoutube,
        },
      };
    }

    return gsspResult;
  };
};
