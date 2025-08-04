//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";
//型定義
import { Errors } from "@/types/errors";
import { StaffData } from "@/types/admin/staff/register";

export const useStaffRegistAPI = () => {
  const { useState, texts, apiRequest } = useCommonSetup();
  const [errors, setErrors] = useState<Errors>();
  const [responseData, setData] = useState<StaffData[]>([]);
  const staffRegist = async (StaffData: any) => {
    const staffId = StaffData.staffId || "";
    const endPoint = staffId ? `staff/update/${staffId}` : "staff/insert";
    const { status, data: responseData } = await apiRequest(
      "admin",
      endPoint,
      "POST",
      StaffData,
      texts.message.regist,
      true
    );
    if (status == 400) {
      setErrors(responseData);
    } else if (status == 200) {
      setData(responseData);
    }
  };

  return { responseData, errors, staffRegist };
};
