export type SystemData = {
    systemSeq: number | null;
    memberRegistrationFlg: number | null;
    memberApprovalFlg: number | null;
    nologinView: number | null;
    imageDownloadFlg: number | null;
}
export const initialSystemData: SystemData = {
    systemSeq:null,
    memberRegistrationFlg:null,
    memberApprovalFlg:null,
    nologinView:null,
    imageDownloadFlg:null
}