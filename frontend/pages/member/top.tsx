import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withAuth } from "@/hocs/withMemberAuth";
import MemberTopPageComponent from "@/components/member/layout/MemberTopPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberTop,
    },
  };
});

export default withMemberisLoginLayout(MemberTopPageComponent, true);
