export interface TAdminGoodsFavoriteSearchRequest {
  goodsId?: string;
  pageNumber: number;
  pageSize: number;
}

export interface TAdminGoodsFavoriteSelect {
  goodsId: string;
  userId: string;
  userName: string;
  companyName: string;
  [key: string]: any;
}
