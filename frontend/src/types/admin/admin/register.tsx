export type TAdminRegistRequest = {
    adminId?: number;
    companyName?: string;
    zipCode?: string;
    todofukenName?: string;
    address1?: string;
    address2?: string;
    tel?: string;
    fax?: string;
    mail?: string;
    companyUrl?: string;
    kobutsuBango?: string;
    copyRight?: string;
    [key: string]: any; 
}