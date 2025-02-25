import React, { useState,useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import { useTheme } from '@mui/material/styles';

interface CustomDatePickerProps {
  name: string;
  selectedDate: Dayjs  | null;
  onDateChange: (date: Dayjs  | null, name: string) => void;
  error?: boolean; 
  onFocus?: (name: string) => void;

}
dayjs.locale('ja'); 
export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ name, selectedDate, onDateChange, error, onFocus }) => {
  const [date, setDate] = useState<Dayjs  | null>(selectedDate);
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const theme = useTheme(); 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DatePicker
       name={name}
       value={selectedDate}
       onChange={(newDate) => onDateChange(newDate, name)}
       format="YYYY/MM/DD"
       slotProps={{
        textField: {
          className: `xl:px-3 border rounded-md w-full`,
          sx: {
            height: '40px', // お好みの高さ
            '& .MuiOutlinedInput-root': {
              height: '40px', // 内部の高さを設定
              width: '200px',
              [theme.breakpoints.down('sm')]: {
                width: '100%', // スマホの場合は幅100%
              },
            },
          },
        },      
      }}
      />
    </LocalizationProvider>
  );
};

