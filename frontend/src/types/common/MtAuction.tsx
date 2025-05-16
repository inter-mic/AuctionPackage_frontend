import  dayjs,{ Dayjs } from 'dayjs';
export type TAuction = {
  auctionSeq?: number;
  spnKbn?: string;
  auctionCount?:string;
  auctionDate?: Dayjs;
  auctionDatetime?: string;
  auctionName?:string;
  displayStartDate?: Dayjs;
  displayStarttime?: string;
  displayEndDate?:Dayjs;
  displayEndtime?:string;
  bidStartDate?:Dayjs;
  bidStarttime?:string;
  bidEndDate?:Dayjs;
  bidEndtime?:string;
  onlinebidApplicationStarttime?:string;
  onlinebidApplicationEndtime?:string;
  auctionGaiyo?:string;
  auctionImageUrl?:string;
  auctionListUrl?:string;
  [key: string]: any; 
}
