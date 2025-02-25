import { GetServerSideProps } from 'next';
import { texts } from '@/config/texts';
//スタイル
import styles from '@/styles/PasswordForm.module.css';
import { useForgotPasswordAPI } from '@/hooks/api/public/useForgotPasswordAPI';
//型定義
import { TPageProps } from '@/types/member/memberPage';
//ホック
import { withSystemSetting } from '@/hocs/withSystemSetting';
import withMemberLayout from '@/hocs/withMemberLayout';
//カスタムフック
import { useFormErrors } from '@/hooks/useFormErrors';

//ボタン
import { SendButton } from '@/components/ui/buttons/sendButton';


export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.forgotPassword
    },
  };
}, false,false);


const Page: React.FC<TPageProps> = () => {  
  const { mail, handleMailChange, handleSubmit, handleInputFocus, errors, responseData } = useForgotPasswordAPI();
  const { formErrors } = useFormErrors(errors);

  return (

      <div className={styles.page}>

        <div className={styles.container}>
          <div >
            <h1 className={styles.title}>{texts.menu.forgotPassword}</h1>
            <label className="text-gray-500 text-sm">
              {texts.label.forgotPassword_note_1}<br/>
              {texts.label.forgotPassword_note_2}
            </label>
            <form onSubmit={(e) => handleSubmit(e, false)}>

              <input
                type="mail"
                placeholder={texts.login.registMail}
                value={mail}
                onChange={handleMailChange}
                onFocus={handleInputFocus}
                className={`${styles.input}`}
              />
              {formErrors?.mail && <p className="error-message">{formErrors.mail}</p>}
              <div className="flex justify-center items-center ">
              <SendButton />
              </div>
            </form>

          </div> 
            </div>
           </div>

  );
};

export default withMemberLayout(Page);