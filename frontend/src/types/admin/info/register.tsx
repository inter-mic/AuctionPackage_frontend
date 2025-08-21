import dayjs, { Dayjs } from "dayjs";
export type TMtInfoRegistRequest = {
  infoSeq: number | null;
  naiyo: string | null;
  naiyoUrl: string | null;
  displayStartDate: Dayjs | null;
  displayStarttime: string | null;
  displayEndDate: Dayjs | null;
  displayEndtime: string | null;
  updateTime: string | null;
};

export const initialInfoData: TMtInfoRegistRequest = {
  infoSeq: null,
  naiyo: null,
  naiyoUrl: null,
  displayStartDate: null,
  displayStarttime: null,
  displayEndDate: null,
  displayEndtime: null,
  updateTime: null,
};

export const formatInfoData = (data: Partial<TMtInfoRegistRequest>): TMtInfoRegistRequest => {
  return {
    infoSeq: data.infoSeq ?? null,
    naiyo: data.naiyo ?? null,
    naiyoUrl: data.naiyoUrl ?? null,
    displayStartDate: data.displayStarttime ? dayjs(data.displayStarttime) : null,
    displayStarttime: data.displayStarttime ?? null,
    displayEndDate: data.displayEndtime ? dayjs(data.displayEndtime) : null,
    displayEndtime: data.displayEndtime ?? null,
    updateTime: data.updateTime ?? null,
  };
};
