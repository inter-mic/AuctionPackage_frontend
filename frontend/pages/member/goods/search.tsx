import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withAuth } from '@/hocs/withMemberAuth';
import GoodsSearchPageComponent from '@/components/member/goods/GoodsSearchPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberGoodsList,
    },
  };
});

export default withMemberisLoginLayout(GoodsSearchPageComponent, true);