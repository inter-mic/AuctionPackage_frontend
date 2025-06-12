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
import { useLoginCertificationAPI } from "@/hooks/api/public/useLoginCertificationAPI";
//ボタン
import { PasswordChangeButton } from "@/components/ui/buttons/passwordChangeButton";
//スタイル
import styles from "@/styles/PasswordForm.module.css";
import { TPageProps } from "@/types/member/memberPage";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.loginCertification,
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
    oldPassword,
    newPassword,
    newPasswordConfirm,
    handleOldPasswordChange,
    handleNewPasswordChange,
    handleNewPasswordConfirmChange,
    handleSubmit,
    errors,
    responseData,
  } = useLoginCertificationAPI(paramsToken);
  const { formErrors } = useFormErrors(errors);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
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
          <label htmlFor="oldPassword" className="formLabel mt-3">
            {texts.loginCertification.oldPassword}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder={texts.loginCertification.oldPassword}
              value={oldPassword}
              onChange={handleOldPasswordChange}
              className={`${styles.input}`}
            />
            <IconButton onClick={handleToggleOldPassword} className={styles.passwordIconButton}>
              {" "}
              {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.oldPassword && <p className="error-message">{formErrors.oldPassword}</p>}
          <label htmlFor="newPassord" className="formLabel mt-3">
            {texts.login.newPassword}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`${styles.input}`}
            />
            <IconButton onClick={handleToggleNewPassword} className={styles.passwordIconButton}>
              {" "}
              {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.newPassword && <p className="error-message">{formErrors.newPassword}</p>}
          <br />
          <label className="text-gray-500 text-sm">
            {texts.label.registPassword_note_1}
            <br />
          </label>
          <label htmlFor="newPassordConfirm" className="formLabel mt-3">
            {texts.login.newPasswordConfirm}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPasswordConfirm ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              className={`${styles.input}`}
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
