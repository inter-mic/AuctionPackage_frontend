//型定義
import { TMtAuctionBidUnit } from "@/types/common/bidUnit";
export type TPageProps = {
  children: React.ReactNode;
  userId: number | null;
  userName: string | null;
  canBid: boolean | null;
  pageTitle: string | null;
  faviconImagePath: string | null;
  logoImagePath: string | null;
  memberRegistrationFlg: boolean | false;
  memberApprovalFlg: boolean | false;
  nologinView: boolean | false;
  kiyakuPath: string | "";
  privacyPolicyPath: string | "";
  companyUrl: string | null;
  kobutsuBango: string | null;
  copyRight: string | null;
  pageSettingList: TtPageSetting[];
  auctionBidUnitList: TMtAuctionBidUnit[];
  optionMemInvoice: boolean | false;
  optionMemShuppinList: boolean | false;
  liveauction: boolean | false;
  livebit: boolean | false;
};

export interface TtPageSetting {
  pageSeq: number; // ページのシーケンス番号
  pageName: string; // ページ名
  pageUrl: string; // ページのURL
}
