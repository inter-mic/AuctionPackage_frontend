import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//コンポーネント
import styles from "@/styles/admin/Layout.module.css";
//スタイル
import toastStyles from "@/styles/toast.module.css";
import { PageProps } from "@/types/admin/adminPage";

export const AdminNoLoginHeaderLayoutComponent: React.FC<PageProps> = ({
  pageTitle,
  faviconImagePath,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {faviconImagePath && <link rel="icon" href={faviconImagePath} />}
      </Head>

      <div className={styles.contentWrapper}>
        <div className={styles.noHeaderMainContent}>
          <main className={styles.main}>
            {children}
            <ToastContainer
              position="top-center"
              toastClassName={toastStyles.toastCustomWidth}
              style={{ zIndex: 11000, top: 70 }}
            />
          </main>
        </div>
      </div>
    </>
  );
};
