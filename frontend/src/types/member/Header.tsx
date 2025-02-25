export interface HeaderProps {
    userId: number | null;
    userName: string | null;
    logoImagePath: string;
    memberRegistrationFlg:boolean | false;
    nologinView:boolean | false;
    pageSettingList: TtPageSetting[];
}
export interface TtPageSetting {
    pageSeq: number; // ページのシーケンス番号
    pageName: string; // ページ名
    pageUrl: string;  // ページのURL
  }