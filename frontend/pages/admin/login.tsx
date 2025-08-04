import { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
//ホック
import { withSystemSetting } from "@/hocs/withSystemSetting";
//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//コンポーネント
import { AdminNoLoginLayoutComponent } from "@/components/admin/layout/AdminNoLoginLayoutComponent";
//API
import { useAdminLogoutAPI } from "@/hooks/api/admin/useAdminLogoutAPI";
//ボタン
import { LoginButton } from "@/components/ui/buttons/admin/loginButton";
//スタイル
import styles from "@/styles/admin/Login.module.css";

interface PageProps {
  faviconImagePath: string;
}

export const getServerSideProps: GetServerSideProps = withSystemSetting(
  async () => {
    return {
      props: {},
    };
  },
  false,
  false
);

const Page: React.FC<PageProps> = ({ faviconImagePath }) => {
  const { useState, useEffect, useRouter, texts } = useCommonSetup();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { adminLogout } = useAdminLogoutAPI();
  useEffect(() => {
    adminLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showPassword, setShowPassword] = useState(false); // パスワードの表示/非表示の状態を管理

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
      credentials: "include",
    });

    if (response.ok) {
      router.push("/admin/dashboard");
    } else {
      toast.error(texts.message.nologin);
    }
  };
  const handleForgotPassword = () => {
    router.push("./forgotPassword"); // パスワードリセットページにリダイレクト
  };
  return (
    <AdminNoLoginLayoutComponent
      faviconImagePath={faviconImagePath}
      pageTitle={texts.menu.adminLoginTitle}
    >
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <h1 className={styles.loginTitle}>{texts.menu.adminLoginTitle}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={texts.member.loginId}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.loginInput}
            />

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
            <LoginButton />
          </form>
          <button className={styles.forgotPasswordButton} onClick={handleForgotPassword}>
            {texts.login.forgotPassword}
          </button>
        </div>
      </div>
    </AdminNoLoginLayoutComponent>
  );
};

export default Page;
