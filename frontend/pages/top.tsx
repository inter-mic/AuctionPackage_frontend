import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withSystemSetting } from '@/hocs/withSystemSetting';
import MemberTopPage from '@/components/member/layout/MemberTopPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberTop,
      breadcrumbs: [{ label: texts.menu.memberTop, url: '/' }]
    },
  };
}, false,true);

export default withMemberisLoginLayout(MemberTopPage, false);