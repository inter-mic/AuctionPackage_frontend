import dayjs, { Dayjs } from 'dayjs';

export const CombineDateTime = (date: Dayjs | null, time: string | null): string | null => {
  if (!date || !time) return null;
  const timeMatch = time.match(/(\d{2}:\d{2}:\d{2})/);
  const standardizedTime = timeMatch ? timeMatch[0] : time;
  return dayjs(date).format('YYYY-MM-DD') + 'T' + standardizedTime;
};
