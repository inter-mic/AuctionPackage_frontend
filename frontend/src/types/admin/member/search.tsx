export interface SearchParams {
    userId?: string;
    userName?: string;
    companyName?: string;
    shoninFlg?: string;
    freeWord?: string;
    pageNumber:number;
    pageSize:number;
    sortKey?: string;
    sortFlg?:boolean;
}

export interface TAdminUserSelect {
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

