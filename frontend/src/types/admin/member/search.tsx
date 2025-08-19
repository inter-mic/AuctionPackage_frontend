export interface TAdminUserSearchRequest {
  userId?: string;
  userName?: string;
  companyName?: string;
  address?: string;
  shoninFlg?: string;
  bidFlg?: string;
  teishiFlg?: string;
  auctionMailJushinFlg?: string;
  freeWord?: string;
  pageNumber: number;
  pageSize: number;
  sortKey?: string;
  sortFlg?: boolean;
}

export interface TAdminUserSelect {
  userId: number;
  userName: string;
  companyName: string;
  address: string;
  fullAddress: string;
  tel: string;
  adminBiko: string;
  shoninFlg: boolean;
  teishiFlg: boolean;
  auctionMailJushinFlg: boolean;
  updateTime: string;
  [key: string]: any;
}
