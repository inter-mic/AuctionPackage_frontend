import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//コンポーネント
import { HeaderComponent } from "@/components/admin/layout/HeaderComponent";
import styles from "@/styles/admin/Layout.module.css";
//スタイル
import toastStyles from "@/styles/toast.module.css";
import { PageProps } from "@/types/admin/adminPage";

export const AdminLayoutComponent: React.FC<PageProps> = ({
  userName,
  pageTitle,
  faviconImagePath,
  logoImagePath,
  liveauction,
  livebit,
  kengen,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {faviconImagePath && <link rel="icon" href={faviconImagePath} />}
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <HeaderComponent
        userName={userName}
        logoImagePath={logoImagePath || ""}
        kengen={kengen}
        liveauction={liveauction}
        livebit={livebit}
      />
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <main className={styles.main}>
            {children}
            <ToastContainer
              position="top-center"
              toastClassName={`${toastStyles.toastCustomWidth} toast-high-z-index`}
            />
          </main>
        </div>
      </div>
    </>
  );
};
