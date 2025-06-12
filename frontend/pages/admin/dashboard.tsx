import { GetServerSideProps } from "next";
//ホック
import { withAuth } from "@/hocs/withAdminAuth";
import withAdminLayout from "@/hocs/withAdminLayout";

import { texts } from "@/config/texts.ja";
//コンポーネント
import { hasPermission, KengenMap } from "@/components/admin/PermissoionsComponent";
//スタイル
import styles from "@/styles/admin/Dashboard.module.css";
//型定義
import { PageProps } from "@/types/admin/adminPage";

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return {
    props: {
      pageTitle: texts.menu.adminDashboard,
    },
  };
});
type SectionProps = {
  title: string;
  children: React.ReactNode;
};
type ButtonProps = {
  label: string;
  url: string;
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.buttonContainer}>{children}</div>
  </div>
);

const Button: React.FC<ButtonProps> = ({ label, url }) => {
  const handleClick = () => {
    // タブ名を安全にエンコードし、URLの一部が異なっても同じタブで開くようにする
    const tabName = encodeURIComponent(url.split("?")[0]); // クエリを無視してタブ名を生成
    const existingTab = window.open("", tabName);

    if (existingTab && !existingTab.closed) {
      // 既存タブがあればURLを変更してフォーカスする
      existingTab.location.href = url;
      existingTab.focus();
    } else {
      // 新しいタブを開く
      window.open(url, tabName, "noopener,noreferrer");
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      {label}
    </button>
  );
};

const Page: React.FC<PageProps & { kengen: KengenMap[] }> = ({ kengen, liveauction, livebit }) => (
  <div className={styles.container}>
    <Section title={texts.menu.adminMemberTitle}>
      {hasPermission(kengen, 101) && (
        <Button label={texts.menu.adminMemberRegist} url="/admin/member/register" />
      )}
      {hasPermission(kengen, 102) && (
        <Button label={texts.menu.adminMemberList} url="/admin/member/search" />
      )}
      {hasPermission(kengen, 103) && (
        <Button
          label={texts.menu.adminMemberAddinfoItemRegist}
          url="/admin/member/addinfoItemRegister"
        />
      )}
      {hasPermission(kengen, 104) && (
        <Button
          label={texts.menu.adminTorihikiJisseki}
          url="/admin/member/torihikijisseki/search"
        />
      )}
    </Section>

    <Section title={texts.menu.adminGoodsTitle}>
      {hasPermission(kengen, 201) && (
        <Button label={texts.menu.adminGoodsRegist} url="/admin/goods/register" />
      )}
      {hasPermission(kengen, 202) && (
        <Button label={texts.menu.adminGoodsList} url="/admin/goods/search" />
      )}
      {hasPermission(kengen, 203) && (
        <Button label={texts.menu.adminGoodsBulkRegist} url="/admin/goods/bulkRegister" />
      )}
      {hasPermission(kengen, 206) && (
        <Button
          label={texts.menu.adminGoodsAddinfoItemRegist}
          url="/admin/goods/addinfoItemRegister"
        />
      )}
      {hasPermission(kengen, 207) && (
        <Button label={texts.menu.adminCategoryRegist} url="/admin/goods/category" />
      )}
    </Section>
    <Section title={texts.menu.adminAuctionTitle}>
      {hasPermission(kengen, 301) && (
        <Button label={texts.menu.adminKaisaiRegist} url="/admin/auction/register" />
      )}
      {hasPermission(kengen, 302) && (
        <Button label={texts.menu.adminBidList} url="/admin/auction/bid/search" />
      )}
      {hasPermission(kengen, 303) && (
        <Button label={texts.menu.adminBidLogList} url="/admin/auction/bid/logSearch" />
      )}
    </Section>
    {(livebit || liveauction) && (
      <Section title={texts.menu.adminLiveTitle}>
        {hasPermission(kengen, 350) && (
          <Button label={texts.menu.adminAuctionner_1} url="/admin/live/auctioneer?spnKbn=1" />
        )}
        {hasPermission(kengen, 350) && (
          <Button label={texts.menu.adminAuctionner_2} url="/admin/live/auctioneer?spnKbn=2" />
        )}
        {hasPermission(kengen, 351) && (
          <Button label={texts.menu.adminLiveBidUnitRegist} url="/admin/live/bidunit" />
        )}
        {hasPermission(kengen, 352) && (
          <Button label={texts.menu.adminLiveMessageRegist} url="/admin/live/message" />
        )}
        {hasPermission(kengen, 353) && (
          <Button label={texts.menu.adminPaddleManagement} url="/admin/live/paddle" />
        )}
        {hasPermission(kengen, 354) && (
          <Button label={texts.menu.adminLiveScreen} url="/admin/live/screen" />
        )}
      </Section>
    )}

    <Section title={texts.menu.adminStaffTitle}>
      {hasPermission(kengen, 401) && (
        <Button label={texts.menu.adminStaffRegist} url="/admin/staff/register" />
      )}
      {hasPermission(kengen, 402) && (
        <Button label={texts.menu.adminStaffList} url="/admin/staff/search" />
      )}
      {hasPermission(kengen, 403) && (
        <Button label={texts.menu.adminKengenRegist} url="/admin/staff/kengen" />
      )}
    </Section>
    <Section title={texts.menu.adminSettingTitle}>
      {hasPermission(kengen, 501) && (
        <Button label={texts.menu.adminInfoRegist} url="/admin/setting/info/register" />
      )}
      {hasPermission(kengen, 502) && (
        <Button label={texts.menu.adminTopImageRegist} url="/admin/setting/topImage/register" />
      )}
      {hasPermission(kengen, 503) && (
        <Button label={texts.menu.adminSystemRegist} url="/admin/setting/system/register" />
      )}
      {hasPermission(kengen, 504) && (
        <Button label={texts.menu.adminAdminRegist} url="/admin/setting/admin/register" />
      )}
      {hasPermission(kengen, 505) && (
        <Button label={texts.menu.adminMailRegist} url="/admin/setting/mail/register" />
      )}
      {hasPermission(kengen, 506) && (
        <Button label={texts.menu.adminPageSetting} url="/admin/setting/page/register" />
      )}
    </Section>
  </div>
);

export default withAdminLayout(Page);
