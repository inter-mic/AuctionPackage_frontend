import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withAuth } from "@/hocs/withMemberAuth";
import CalenderPageComponent from "@/components/member/schedule/CalenderPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberAuction,
    },
  };
});

export default withMemberisLoginLayout(CalenderPageComponent, true);
