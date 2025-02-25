export interface SearchParams {

}

export interface Result {
    staffId: number;
    staffName: string;
    loginId: string;
    mail: string;
    kengenName: string;
    teishiFlg: boolean;
    deleteFlg: boolean;
    [key: string]: any; 
}