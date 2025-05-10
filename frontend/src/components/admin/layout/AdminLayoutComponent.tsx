import type { Metadata } from "next";
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
//コンポーネント
import { HeaderComponent } from '@/components/admin/layout/HeaderComponent';
import styles from '@/styles/admin/Layout.module.css';
//スタイル
import toastStyles from '@/styles/toast.module.css';
import { PageProps } from '@/types/admin/adminPage';

export const AdminLayoutComponent: React.FC<PageProps> = ({ userName, pageTitle, faviconImagePath, logoImagePath, kengen, children }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {faviconImagePath && <link rel="icon" href={faviconImagePath} />}
      </Head>
      
      <HeaderComponent  userName={userName}logoImagePath={logoImagePath || ""} kengen={kengen}/>
      <div className={styles.contentWrapper}>
     
        <div className={styles.mainContent}>
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