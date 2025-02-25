export interface SearchParams {
    userId?: string;
    userName?: string;
    companyName?: string;
    shoninFlg?: string;
    freeWord?: string;
}

export interface Result {
    userId: number;
    userName: string;
    companyName: string;    
    fullAddress: string;
    tel: string;
    adminBiko: string;
    shoninFlg: boolean;
    updateTime: string;
    [key: string]: any; 
}

