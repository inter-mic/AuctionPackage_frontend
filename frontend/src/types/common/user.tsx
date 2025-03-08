  export type TVUserMember = {
    userId?: number;
    loginId?: string;
    userName?: string;
    userNameKana?: string;
    companyName?: string;
    companyNameKana?: string;
    companyUrl?: string;
    zipCode?: string;
    todofukenName?: string;
    address1?: string;
    address2?: string;
    auctionMailJushinFlg?: boolean;
    tel?: string;
    mobile?: string;
    fax?: string;
    mail?: string;

  }

  export type TUserMemberRegistRequest = {
    userId?: number;
    loginId?: string;
    userName?: string;
    userNameKana?: string;
    companyName?: string;
    companyNameKana?: string;
    companyUrl?: string;
    zipCode?: string;
    todofukenName?: string;
    address1?: string;
    address2?: string;
    auctionMailJushinFlg?: boolean;
    tel?: string;
    mobile?: string;
    fax?: string;
    mail?: string;
    privacyPolicyAgreed?: boolean;
    kiyakuAgreed?: boolean;
  }
