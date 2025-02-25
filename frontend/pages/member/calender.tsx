import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withAuth } from '@/hocs/withMemberAuth';
import CalenderPageComponent from '@/components/member/schedule/CalenderPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
    return {
      props: {
        pageTitle: texts.menu.memberAuction
        
      },
    };
  });
  
  export default withMemberisLoginLayout(CalenderPageComponent, true);