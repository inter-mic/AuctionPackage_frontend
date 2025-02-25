import  dayjs,{ Dayjs } from 'dayjs';
export interface TMtAuction {
    auctionSeq: number;
    auctionName: string;
    displayEndtime:Dayjs | null;
}

export interface TMaxAuctionCount {
    auctionCount: number;
}