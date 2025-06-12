import { GetServerSideProps } from "next";
import styles from "@/styles/ForgotPassword.module.css"; // CSSモジュールのインポート
import "react-toastify/dist/ReactToastify.css";
import { texts } from "@/config/texts.ja";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
import { useFormErrors } from "@/hooks/useFormErrors";
//API
import { useReissuePasswordAPI } from "@/hooks/api/admin/staff/useStaffChangePasswordAPI";
//型定義
import { PageProps } from "@/types/admin/adminPage";
//ボタン
import { PasswordChangeButton } from "@/components/ui/buttons/passwordChangeButton";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.changePassword,
    },
  };
});

const Page: React.FC<PageProps> = () => {
  const { useState, useEffect, useCallback, useRouter, texts, apiRequest } = useCommonSetup();
  const {
    oldPassword,
    newPassword,
    newPasswordConfirm,
    handleOldPasswordChange,
    handleNewPasswordChange,
    handleNewPasswordConfirmChange,
    handleSubmit,
    handleInputFocus,
    errors,
    responseData,
  } = useReissuePasswordAPI();
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
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="oldPassword" className="mr-2">
            {texts.chanePassword.oldPassword}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder={texts.chanePassword.oldPassword}
              value={oldPassword}
              onChange={handleOldPasswordChange}
              onFocus={() => handleInputFocus("oldPassword")}
              className={`${styles.passwordInput}`}
            />
            <IconButton onClick={handleToggleOldPassword} className={styles.passwordIconButton}>
              {" "}
              {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.oldPassword && <p className="error-message">{formErrors.oldPassword}</p>}
          <label htmlFor="newPassord" className="mr-2">
            {texts.login.newPassword}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPassword}
              onChange={handleNewPasswordChange}
              onFocus={() => handleInputFocus("newPassword")}
              className={`${styles.passwordInput}`}
            />
            <IconButton onClick={handleToggleNewPassword} className={styles.passwordIconButton}>
              {" "}
              {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </div>
          {formErrors?.newPassword && <p className="error-message">{formErrors.newPassword}</p>}
          <label className="text-gray-500 text-sm">
            {texts.label.registPassword_note_1}
            <br />
          </label>
          <label htmlFor="newPassordConfirm" className="mr-2">
            {texts.login.newPasswordConfirm}
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNewPasswordConfirm ? "text" : "password"}
              placeholder={texts.login.newPassword}
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              onFocus={() => handleInputFocus("newPasswordConfirm")}
              className={`${styles.passwordInput} `}
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

export default withAdminLayout(Page);
