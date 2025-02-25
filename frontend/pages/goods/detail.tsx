import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withSystemSetting } from '@/hocs/withSystemSetting';
import GoodsDetailPage from '@/components/member/goods/GoodsDetailPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberGoodsDetail
      
    },
  };
}, false,true);

export default withMemberisLoginLayout(GoodsDetailPage, false);