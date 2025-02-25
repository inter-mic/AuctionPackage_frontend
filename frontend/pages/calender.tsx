import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
import { withSystemSetting } from '@/hocs/withSystemSetting';
import CalenderPageComponent from '@/components/member/schedule/CalenderPageComponent';
import withMemberisLoginLayout from '@/hocs/withMemberisLoginLayout';

export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
    return {
      props: {
        pageTitle: texts.menu.memberAuction
        
      },
    };
  }, false,true);
  
  export default withMemberisLoginLayout(CalenderPageComponent, false);