import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withSystemSetting } from "@/hocs/withSystemSetting";
import GoodsDetailPage from "@/components/member/goods/GoodsDetailPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { query, locale } = context;

    const goodsId = query.goodsId;
    const texts = getTexts(locale);

    if (!goodsId) {
      return {
        redirect: {
          destination: "/login", // または別のURL
          permanent: false, // 302 リダイレクト（true にすると 301）
        },
      };
    }
    return {
      props: {
        pageTitle: texts.menu.memberGoodsDetail,
      },
    };
  },
  false,
  true
);

export default withMemberisLoginLayout(GoodsDetailPage, false);
