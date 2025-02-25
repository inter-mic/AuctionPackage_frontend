import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
//スタイル
import styles from '@/styles/member/Complete.module.css';
//型定義
import { TPageProps } from '@/types/member/memberPage';
//ホック
import { withSystemSetting } from '@/hocs/withSystemSetting';
import withMemberLayout from '@/hocs/withMemberLayout';


//ボタン
import { BackLoginButton } from '@/components/ui/buttons/member/backLoginButton';


export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  const otherData = {};
  return {
    props: {
      pageTitle: texts.menu.memberSignupCompletion
    },
  };
}, false,true);


const Page = ({ memberApprovalFlg }: TPageProps) => {

  return (
   
      <div className={styles.page}>

        <div className={styles.container}>
          <div >
            <h1 className={styles.title}>{texts.menu.memberSignupCompletion}</h1>
            <label className="flex justify-center items-center text-gray-500 text-sm">
              <div >
                {memberApprovalFlg && (
                  <h1 className={styles.newCustomerTitle}>{texts.signup.signup_note_1}</h1>
                )}{(
                  <h1 className={styles.newCustomerTitle}>{texts.signup.signup_note_2}</h1>
                )}
              </div>
            </label>
            <div className="flex justify-center items-center ">
              <BackLoginButton />
            </div>

          </div>
        </div>
      </div>

  );
};

export default withMemberLayout(Page);