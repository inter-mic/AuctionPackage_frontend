import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { withAuth } from "@/hocs/withMemberAuth";
import GoodsDetailPageComponent from "@/components/member/goods/GoodsDetailPageComponent";
import withMemberisLoginLayout from "@/hocs/withMemberisLoginLayout";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  const { locale } = context;
  const texts = getTexts(locale);
  return {
    props: {
      pageTitle: texts.menu.memberGoodsDetail,
    },
  };
});

export default withMemberisLoginLayout(GoodsDetailPageComponent, true);
