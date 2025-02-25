import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withAuth } from '@/hocs/withMemberAuth';
import MemberTopPageComponent from '@/components/member/common/MemberTopPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberTop
    },
  };
});

export default withMemberisLoginLayout(MemberTopPageComponent, true);