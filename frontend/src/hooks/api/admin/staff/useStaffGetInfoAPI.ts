//カスタムフック
import { useCommonSetup } from "@/hooks/useCommonSetup";

export const useStaffGetInfoAPI = () => {
  const { useState, apiRequest } = useCommonSetup();
  const [data, setData] = useState(null);
  const staffGetInfo = async (staffId: string) => {
    const endPoint = `staff/search/${staffId}`;
    const { data: responseData } = await apiRequest("admin", endPoint, "POST", null, "", true);
    if (responseData) {
      setData(responseData);
    }
  };

  return { data, staffGetInfo };
};
