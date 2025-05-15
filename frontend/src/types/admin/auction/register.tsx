import  dayjs,{ Dayjs } from 'dayjs';
  export type auctionData = {
    auctionSeq: number | null;
    spnKbn: string | null;
    auctionDate: Dayjs | null;
    auctionDatetime: string | null;
    auctionName:string | null;
    displayStartDate: Dayjs | null;
    displayStarttime: string | null;
    displayEndDate:Dayjs | null;
    displayEndtime:string | null;
    bidStartDate:Dayjs | null;
    bidStarttime:string | null;
    bidEndDate:Dayjs | null;
    bidEndtime:string | null;
    onlinebidApplicationStartDate:Dayjs | null;
    onlinebidApplicationStartTime:string | null;
    onlinebidApplicationEndDate:Dayjs | null;
    onlinebidApplicationEndTime:string | null;
    auctionGaiyo:string | null;
    updateTime:string | null;
    auctionImageIsDelete:boolean | false;
    auctionImageUrl:string | null;
    auctionListIsDelete:boolean | false;
    auctionListUrl:string | null;
    shimeTime: string | null;
    shimeFlg: boolean;
    paymentDeadlineDate: Dayjs | null;
  }

  export const initialAuctionData: auctionData = {
    auctionSeq: null,
    spnKbn: null,
    auctionDate: null,
    auctionDatetime: null,
    auctionName: null,
    displayStartDate: null,
    displayStarttime: null,
    displayEndDate: null,
    displayEndtime: null,
    bidStartDate: null,
    bidStarttime: null,
    bidEndDate: null,
    bidEndtime: null,
    onlinebidApplicationStartDate: null,
    onlinebidApplicationStartTime: null,
    onlinebidApplicationEndDate: null,
    onlinebidApplicationEndTime: null,
    auctionGaiyo: null,
    updateTime: null,
    auctionImageIsDelete: false,
    auctionImageUrl: null,
    auctionListIsDelete: false,
    auctionListUrl: null,
    shimeTime: null,
    shimeFlg: false,
    paymentDeadlineDate: null,
};


export const formatAuctionData = (data: Partial<auctionData>): auctionData => {
  return {
    auctionSeq: data.auctionSeq ?? null,
    spnKbn: data.spnKbn ?? null,
    auctionDate: data.auctionDatetime ? dayjs(data.auctionDatetime) : null,
    auctionDatetime: data.auctionDatetime ?? null,
    auctionName: data.auctionName ?? null,
    displayStartDate: data.displayStarttime ? dayjs(data.displayStarttime) : null,
    displayStarttime: data.displayStarttime ?? null,
    displayEndDate: data.displayEndtime ? dayjs(data.displayEndtime) : null,
    displayEndtime: data.displayEndtime ?? null,
    bidStartDate: data.bidStarttime ? dayjs(data.bidStarttime) : null,
    bidStarttime: data.bidStarttime ?? null,
    bidEndDate: data.bidEndtime ? dayjs(data.bidEndtime) : null,
    bidEndtime: data.bidEndtime ?? null,
    onlinebidApplicationStartDate: data.onlinebidApplicationStartDate ?? null,
    onlinebidApplicationStartTime: data.onlinebidApplicationStartTime ?? null,
    onlinebidApplicationEndDate: data.onlinebidApplicationEndDate ?? null,
    onlinebidApplicationEndTime: data.onlinebidApplicationEndTime ?? null,
    auctionGaiyo: data.auctionGaiyo ?? null,
    updateTime: data.updateTime ?? null,
    auctionImageIsDelete: data.auctionImageIsDelete ?? false,
    auctionImageUrl: data.auctionImageUrl ?? null,
    auctionListUrl: data.auctionListUrl ?? null,
    auctionListIsDelete: data.auctionListIsDelete ?? false,
    shimeTime: data.shimeTime ?? null,
    shimeFlg: data.shimeFlg ?? false,
    paymentDeadlineDate: data.paymentDeadlineDate ? dayjs(data.paymentDeadlineDate) : null,
  };
};
