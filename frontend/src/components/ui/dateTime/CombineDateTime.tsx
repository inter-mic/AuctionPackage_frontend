import dayjs, { Dayjs } from 'dayjs';

export const CombineDateTime = (date: Dayjs | null, time: string | null): string | null => {
  if (!date || !time) return null;
  const timeMatch = time.match(/(\d{2}:\d{2}:\d{2})/);
  const standardizedTime = timeMatch ? timeMatch[0] : time;
  
  // 日付をローカル時間として正しく処理
  const localDate = date.local();
  return localDate.format('YYYY-MM-DD') + 'T' + standardizedTime;
};
