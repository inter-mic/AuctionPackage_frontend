import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withAuth } from '@/hocs/withMemberAuth';
import ContactPageCompletionComponent from '@/components/member/contact/ContactPageCompletionComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberContactCompletion
    },
  };
});

export default withMemberisLoginLayout(ContactPageCompletionComponent, true);