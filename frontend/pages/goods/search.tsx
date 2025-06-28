import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withSystemSetting } from "@/hocs/withSystemSetting";
import GoodsSearchPage from "@/components/member/goods/GoodsSearchPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { query, locale } = context;

    const auctionSeq = query.auctionSeq;
    const texts = getTexts(locale);

    if (!auctionSeq) {
      return {
        redirect: {
          destination: "/login", // または別のURL
          permanent: false, // 302 リダイレクト（true にすると 301）
        },
      };
    }
    return {
      props: {
        pageTitle: texts.menu.memberGoodsList,
      },
    };
  },
  false,
  true
);

export default withMemberisLoginLayout(GoodsSearchPage, false);
