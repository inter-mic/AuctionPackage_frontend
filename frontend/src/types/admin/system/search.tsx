export interface SearchParams {

}

export interface Result {
    systemSeq: number | null;
    memberRegistrationFlg: number | null;
    memberApprovalFlg: number;
    nologinView: number;
    imageDownloadFlg: number;
    faviconImagePath: string | null;
    logoImagePath: string;
    kiyakuPath: string;
    privacyPolicyPath: string;
    [key: string]: any; 
}