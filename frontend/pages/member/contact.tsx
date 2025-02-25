import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withAuth } from '@/hocs/withMemberAuth';
import ContactPageComponent from '@/components/member/contact/ContactPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';


export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberContact
    },
  };
});
export default withMemberisLoginLayout(ContactPageComponent, true);