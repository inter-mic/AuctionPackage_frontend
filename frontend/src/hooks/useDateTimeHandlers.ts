import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { Errors } from "@/types/errors";

interface UseDateTimeHandlersProps<T> {
  setData: Dispatch<SetStateAction<T>>;
  errors?: Errors;
  setFormErrors: Dispatch<SetStateAction<Errors>>;
}

export const useDateTimeHandlers = <T extends Record<string, any>>({
  setData,
  errors,
  setFormErrors,
}: UseDateTimeHandlersProps<T>) => {
  const handleDateChange =
    (field: keyof T) => (date: Dayjs | null, name: string) => {
      // Invalid Dateの場合は処理をスキップ
      if (date && !date.isValid()) {
        return;
      }
      
      // 日付をローカル時間として正しく処理
      const localDate = date ? date.local() : null;
      setData((prev) => {
        const updatedData = { ...prev, [field]: localDate };
        return updatedData;
      });
      
      if (errors?.[name]) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    };

  const handleTimeChange =
    (field: keyof T) => (time: string | null, name: string) => {
      setData((prev) => {
        const updatedData = { ...prev, [field]: time };
        return updatedData;
      });
      
      if (errors?.[name]) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    };

  return {
    handleDateChange,
    handleTimeChange,
  };
};
