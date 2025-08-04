import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//コンポーネント
import styles from "@/styles/admin/LayoutNoLogin.module.css";
//スタイル
import toastStyles from "@/styles/toast.module.css";

interface LayoutProps {
  children: React.ReactNode;
  faviconImagePath: string;
  pageTitle: string;
}

export const AdminNoLoginLayoutComponent: React.FC<LayoutProps> = ({
  pageTitle,
  faviconImagePath,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={faviconImagePath} />
      </Head>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <main className={styles.main}>
            {children}
            <ToastContainer position="top-center" toastClassName={toastStyles.toastCustomWidth} />
          </main>
        </div>
      </div>
    </>
  );
};
