import { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { getTexts } from "@/config/texts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
//ホック
import { withSystemSetting } from "@/hocs/withSystemSetting";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useFormErrors } from "@/hooks/useFormErrors";
//API
import { useReissuePasswordAPI } from "@/hooks/api/public/useReissuePasswordAPI";
//ボタン
import { PasswordChangeButton } from "@/components/ui/buttons/passwordChangeButton";
//スタイル
import styles from "@/styles/PasswordForm.module.css";
import { TPageProps } from "@/types/member/memberPage";

interface PageProps {
  faviconImagePath: string;
}

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.reissuePassword,
      },
    };
  },
  false,
  false
);

const Page: React.FC<TPageProps> = () => {
  const params = useSearchParams();
  const paramsToken = params ? params.get("token") : null;
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const {
    newPassword,
    newPasswordConfirm,
    handleNewPasswordChange,
    handleNewPasswordConfirmChange,
    handleSubmit,
    errors,
    responseData,
  } = useReissuePasswordAPI(paramsToken);
  const { formErrors } = useFormErrors(errors);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const handleToggleNewPasswordConfirm = () => {
    setShowNewPasswordConfirm(!showNewPasswordConfirm);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form onSubmit={(e) => handleSubmit(e, false)}>
          {formErrors?.token && <p className="error-message">{formErrors.token}</p>}
          <label htmlFor="newPassord" className="mr-2">
            {texts.login.newPassword}
          </label>
          <br />
          <label className="text-gray-500 text-sm">
            {texts.label.registPassword_note_1}
            <br />
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`${styles.passwordInput}`}
            />
            <IconButton onClick={handleToggleNewPassword} className={styles.passwordIconButton}>
              {" "}
              {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.newPassword && <p className="error-message">{formErrors.newPassword}</p>}
          <label htmlFor="newPassordConfirm" className="mr-2">
            {texts.login.newPasswordConfirm}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPasswordConfirm ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              className={`${styles.passwordInput}`}
            />
            <IconButton
              onClick={handleToggleNewPasswordConfirm}
              className={styles.passwordIconButton}
            >
              {" "}
              {showNewPasswordConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.newPasswordConfirm && (
            <p className="error-message">{formErrors.newPasswordConfirm}</p>
          )}

          <PasswordChangeButton />
        </form>
      </div>
    </div>
  );
};

export default withMemberLayout(Page);
