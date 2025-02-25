import { GetServerSideProps } from 'next';
import "react-toastify/dist/ReactToastify.css";
//ホック
import { withSystemSetting } from '@/hocs/withSystemSetting';
//カスタムフック
import { useCommonSetup } from '@/hooks/useCommonSetup';
import { useFormErrors } from '@/hooks/useFormErrors';
//API
import { useForgotPasswordAPI } from '@/hooks/api/public/useForgotPasswordAPI';
import { useAdminLogoutAPI } from '@/hooks/api/admin/useAdminLogoutAPI';
//コンポーネント
import { AdminNoLoginLayoutComponent } from '@/components/admin/AdminNoLoginLayoutComponent';
//ボタン
import { SendButton } from '@/components/ui/buttons/sendButton';
//スタイル
import styles from '@/styles/PasswordForm.module.css';



interface PageProps {
  faviconImagePath: string;
}

export const getServerSideProps: GetServerSideProps = withSystemSetting(async (context) => {
  return {
    props: {},
  };
}, false, false);

const Page: React.FC<PageProps> = ({ faviconImagePath }) => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const { mail, handleMailChange, handleSubmit, handleInputFocus, errors, responseData } = useForgotPasswordAPI();
  const { formErrors } = useFormErrors(errors);
  const { adminLogout } = useAdminLogoutAPI();
  useEffect(() => {
    adminLogout(); 
  }, [adminLogout]); 
  return (

    <AdminNoLoginLayoutComponent faviconImagePath={faviconImagePath} pageTitle={texts.menu.forgotPassword}>

      <div className={styles.page}>
        <div className={styles.container}>
        <h1 className={styles.title}>{texts.menu.forgotPassword}</h1>
            <label className="text-gray-500 text-sm">
            {texts.label.forgotPassword_note_1}<br/>
            {texts.label.forgotPassword_note_2}
            </label>
          <form onSubmit={(e) => handleSubmit(e, true)}>
           
            <input
              type="mail"
              placeholder={texts.login.registMail}
              value={mail}
              onChange={handleMailChange}
              onFocus={handleInputFocus}
              className={`${styles.input} `}
            />
            {formErrors?.mail && <p className="error-message">{formErrors.mail}</p>}

            <div className="flex justify-center items-center ">
              <SendButton />
              </div>
          </form>
        </div>

      </div>

    </AdminNoLoginLayoutComponent>
  );
};

export default Page;