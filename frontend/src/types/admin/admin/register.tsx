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
    auctionMailJushinFlg?: boolean;
    companyUrl?: string;
    kobutsuBango?: string;
    copyRight?: string;
    invoiceNo?: string;
    furikomiKozaName?: string;
    furikomiGinkoName?: string;
    furikomiShitenName?: string;
    furikomiKozaShurui?: string;
    furikomiKozaNo?: string;
    [key: string]: any; 
}