import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withSystemSetting } from "@/hocs/withSystemSetting";
import TopPageComponent from "@/components/member/top/TopPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.memberTop,
        breadcrumbs: [{ label: texts.menu.memberTop, url: "/" }],
      },
    };
  },
  false,
  true
);

export default withMemberisLoginLayout(TopPageComponent, false);
