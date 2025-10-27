import React from 'react';
//CSS
import styles from '@/styles/member/Footer.module.css';
interface Props {
  kiyakuPath: string;
  privacyPolicyPath: string;
  companyUrl: string;
  kobutsuBango: string;
  copyRight: string;
}
export const FooterComponent: React.FC<Props> = ({ kiyakuPath, privacyPolicyPath, companyUrl,kobutsuBango,copyRight }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {kiyakuPath !=  "" && (<a href={kiyakuPath} target="_blank">ご利用規約</a>)}
        {privacyPolicyPath !=  "" && (<a href={privacyPolicyPath} target="_blank">プライバシーポリシー</a>)}
        {companyUrl != "" && (<a href={companyUrl} target="_blank">会社概要</a>)}
      </div>
      <div className="mt-5">
      <span >{kobutsuBango}</span><br/> 
      <span className="py-2">{copyRight}</span> 
      </div>
      
      
    </footer>

  );
}