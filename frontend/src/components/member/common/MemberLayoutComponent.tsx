import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head';

//コンポーネント
import { HeaderComponent } from '@/components/member/common/HeaderComponent';
import { FooterComponent } from '@/components/member/common/FooterComponent';
import styles from '@/styles/member/Layout.module.css';
//スタイル
import toastStyles from '@/styles/toast.module.css';
//型定義
import { TPageProps } from '@/types/member/memberPage';


export const MemberLayoutComponent: React.FC<TPageProps> = ({ userId
  , userName
  , pageTitle
  , faviconImagePath
  , logoImagePath
  , memberRegistrationFlg
  , nologinView
  , children
  , kiyakuPath
  , privacyPolicyPath
  , companyUrl
  , pageSettingList
  , kobutsuBango
  , copyRight
  , optionMemInvoice }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {faviconImagePath && <link rel="icon" href={faviconImagePath} />}
      </Head>
      <HeaderComponent
        userId={userId}
        userName={userName}
        logoImagePath={logoImagePath || ""}
        nologinView={nologinView} 
        memberRegistrationFlg={memberRegistrationFlg}
        pageSettingList={pageSettingList} 
        optionMemInvoice={optionMemInvoice} />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <main className={styles.main}>
            {children}
            <ToastContainer
              position="top-center"
              toastClassName={toastStyles.toastCustomWidth}
            />
          </main>
        </div>
      </div>
      <FooterComponent
        kiyakuPath={kiyakuPath || ""}
        privacyPolicyPath={privacyPolicyPath || ""}
        companyUrl={companyUrl || ""}
        kobutsuBango={kobutsuBango || ""}
        copyRight={copyRight || ""}
      />
    </>
  );
};