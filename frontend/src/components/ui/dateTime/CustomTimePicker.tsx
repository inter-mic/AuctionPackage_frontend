import React, { useState, useEffect } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTheme } from "@mui/material/styles";

interface CustomTimePickerProps {
  name: string;
  selectedTime: string | null;
  onTimeChange: (time: string | null, name: string) => void;
  error?: boolean;
}
dayjs.extend(utc);
dayjs.extend(timezone);
export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  name,
  selectedTime,
  onTimeChange,
}) => {
  const [time, setTime] = useState<dayjs.Dayjs | null>(
    selectedTime ? dayjs(selectedTime).tz("Asia/Tokyo") : null
  );

  useEffect(() => {
    if (selectedTime) {
      let parsedTime: dayjs.Dayjs | null = null;

      if (/^\d{2}:\d{2}$/.test(selectedTime)) {
        // hh:mm フォーマットの場合
        parsedTime = dayjs(selectedTime, "HH:mm", true);
      } else if (dayjs(selectedTime).isValid()) {
        // ISO 8601 形式の場合
        parsedTime = dayjs(selectedTime);
      }

      if (parsedTime?.isValid()) {
        setTime(parsedTime.tz("Asia/Tokyo"));
      }
    }
  }, [selectedTime]);

  const handleChange = (newTime: Dayjs | null) => {
    const formattedTime = newTime ? newTime.tz("Asia/Tokyo").format("HH:mm") : null;
    onTimeChange(formattedTime, name);
  };

  const theme = useTheme();
  return (
    <div>
      <TimePicker
        name={name}
        value={time}
        onChange={handleChange}
        slotProps={{
          textField: {
            className: ` border rounded-md  w-full`,
            sx: {
              height: "40px", // お好みの高さ
              "& .MuiOutlinedInput-root": {
                height: "40px",
                width: "200px",
                [theme.breakpoints.down("sm")]: {
                  width: "100%", // スマホの場合は幅100%
                },
              },
            },
          },
        }}
        ampm={false} // 24 時間形式
      />
    </div>
  );
};
