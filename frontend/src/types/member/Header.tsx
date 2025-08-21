export interface HeaderProps {
    userId: number | null;
    userName: string | null;
    logoImagePath: string;
    memberRegistrationFlg:boolean | false;
    nologinView:boolean | false;
    optionMemInvoice:boolean | false;
    optionMemShuppinList:boolean | false;
    pageSettingList: TtPageSetting[];
    liveauction: boolean | false;
    livebit: boolean | false;
}
export interface TtPageSetting {
    pageSeq: number; // ページのシーケンス番号
    pageName: string; // ページ名
    pageUrl: string;  // ページのURL
  }