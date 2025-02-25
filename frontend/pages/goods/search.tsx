import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withSystemSetting } from '@/hocs/withSystemSetting';
import GoodsSearchPage from '@/components/member/goods/GoodsSearchPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberGoodsList
      
    },
  };
}, false,true);

export default withMemberisLoginLayout(GoodsSearchPage, false);