export interface TSystemSettingSelect {
  systemSeq: number | null;
  memberRegistrationFlg: number | null;
  memberApprovalFlg: number;
  nologinView: number;
  imageDownloadFlg: number;
  faviconImagePath: string | null;
  logoImagePath: string;
  kiyakuPath: string;
  privacyPolicyPath: string;
  youtubeIframe: string;
  [key: string]: any;
}
