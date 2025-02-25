import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
//スタイル
import styles from '@/styles/member/Complete.module.css';
//型定義
import { TPageProps } from '@/types/member/memberPage';
//ホック
import { withSystemSetting } from '@/hocs/withSystemSetting';
import withMemberLayout from '@/hocs/withMemberLayout';


export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.memberContactCompletion
    },
  };
}, false,false);


const Page: React.FC<TPageProps> = () => {
  return (
    
      <div className={styles.page}>

        <div className={styles.container}>
          <div >
            <h1 className={styles.title}>{texts.menu.memberContactCompletion}</h1>
            <label className="flex justify-center items-center text-gray-500 text-sm">
              <div>
              <h1>{texts.contact.confirm_complete_note_1}</h1>
              </div>
            </label>
            
          </div>
        </div>
      </div>

  );
};

export default withMemberLayout(Page);