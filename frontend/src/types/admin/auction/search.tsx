import  { Dayjs } from 'dayjs';
export interface TMtAuction {
    auctionSeq: number;
    auctionName: string;
    displayEndtime:Dayjs | null;
    bidEndtime:Dayjs | null;
}

export interface TMaxAuctionCount {
    auctionCount: number;
}