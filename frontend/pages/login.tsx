import { GetServerSideProps } from "next";
import { getTexts } from "@/config/texts";
import { useLocale } from "@/hooks/useLocale";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
//スタイル
import styles from "@/styles/member/Login.module.css";
//型定義
import { TPageProps } from "@/types/member/memberPage";
//ホック
import { withSystemSetting } from "@/hocs/withSystemSetting";
import withMemberLayout from "@/hocs/withMemberLayout";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//API
import { useMemberLogoutAPI } from "@/hooks/api/member/useMemberLogoutAPI";
//ボタン
import { LoginButton } from "@/components/ui/buttons/member/loginButton";
import { ToSignupButton } from "@/components/ui/buttons/member/toSignupButton";

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async (context) => {
    const { locale } = context;
    const texts = getTexts(locale);
    return {
      props: {
        pageTitle: texts.menu.memberLoginTitle,
      },
    };
  },
  false,
  false
);

const Page: React.FC<TPageProps> = ({ memberRegistrationFlg }) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { memberLogout } = useMemberLogoutAPI();
  useEffect(() => {
    memberLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showPassword, setShowPassword] = useState(false); // パスワードの表示/非表示の状態を管理
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEMBER_API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
      credentials: "include",
    });

    if (response.ok) {
      router.push("/member/top");
    } else {
      toast.error(texts.message.nologin);
    }
  };
  const handleForgotPassword = () => {
    router.push("./forgotPassword"); // パスワードリセットページにリダイレクト
  };

  const loginSectionClassName = memberRegistrationFlg ? `${styles.loginSection}` : "";
  return (
    <div className={styles.loginPage}>
      <div className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <div className={loginSectionClassName}>
            <h1 className={styles.loginTitle}>{texts.menu.memberLoginTitle}</h1>
            <form onSubmit={handleSubmit}>
              <label>{texts.member.loginId}</label>
              <input
                type="text"
                placeholder={texts.member.loginId}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.loginInput}
              />

              <label className={styles.label}>{texts.login.password}</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={texts.login.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                />
                <IconButton onClick={handleTogglePassword} className={styles.passwordIconButton}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </div>
              <div className={styles.loginButtonContainer}>
                <LoginButton />
              </div>
            </form>
            <button className={styles.forgotPasswordButton} onClick={handleForgotPassword}>
              {texts.login.forgotPassword}
            </button>
          </div>
          {memberRegistrationFlg && (
            <div className={styles.newCustomerContainer}>
              <h1 className={styles.newCustomerTitle}>{texts.login.newCustomer}</h1>
              <ToSignupButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withMemberLayout(Page);
