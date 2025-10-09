import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head';

//コンポーネント
import { HeaderComponent } from '@/components/member/layout/MemberHeaderComponent';
import { FooterComponent } from '@/components/member/layout/MemberFooterComponent';
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
  , optionMemInvoice
  , optionMemShuppinList
  , liveauction
  , livebit
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
        userId={userId}
        userName={userName}
        logoImagePath={logoImagePath || ""}
        nologinView={nologinView} 
        memberRegistrationFlg={memberRegistrationFlg}
        pageSettingList={pageSettingList} 
        optionMemInvoice={optionMemInvoice}
        optionMemShuppinList={optionMemShuppinList}
        liveauction={liveauction}
        livebit={livebit}
       />

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