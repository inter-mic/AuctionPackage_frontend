import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withAuth } from "@/hocs/withMemberAuth";
import TopPageComponent from "@/components/member/top/TopPageComponent";
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

export default withMemberisLoginLayout(TopPageComponent, true);
