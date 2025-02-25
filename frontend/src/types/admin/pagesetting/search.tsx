export type TTtPageSetting ={
    pageSeq: number;
    pageName: string;
    pageUrl: string;
    pageLoginFlg: boolean;

    [key: string]: any; 
}

export interface ShomeiResult {
    shomeiId: number;
    shomei: string;
    updateTime: string;
    [key: string]: any; 
}
