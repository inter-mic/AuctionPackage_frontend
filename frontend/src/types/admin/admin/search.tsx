export interface SearchParams {

}

export interface Result {
    adminId: number;
    companyName: string;
    zipCode: string;
    todofukenName: string;
    address1: string;
    address2: string;
    tel: string;
    fax: string;
    mail: string;
    companyUrl: string;
    [key: string]: any; 
}